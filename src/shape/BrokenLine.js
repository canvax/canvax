/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 折线 类
 *
 * 对应context的属性有
 * @pointList 各个顶角坐标
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import _Math from "../geom/Math"

const mathMin = Math.min;
const mathMax = Math.max; 

export default class BrokenLine extends Shape
{
    constructor(opt){
        opt = Utils.checkOpt( opt ); 
        
        var _context = _.extend(true,{
            lineType: null,
            smooth: false,
            smoothMonotone: 'none',
            pointList: [], //{Array}  // 必须，各个顶角坐标
        }, opt.context );

        if( _context.smooth === true || _context.smooth === 'true' ){
            _context.smooth = 0.5;  //smooth 0-1
        }

        opt.context = _context;
        opt.type = "brokenline";
        
        super(opt);

    }

    watch(name, value, preValue) 
    {
        let names = ['pointList', 'smooth', 'lineType', 'smoothMonotone']
        if ( names.indexOf( name ) > -1 ) {
            this.graphics.clear();
            this.draw( this.graphics );
        }
    }


    draw( graphics ) 
    {
        let pointList = this.context.pointList;
        this.drawGraphics( graphics, pointList, this.context.smooth, this.context.smoothMonotone );
        return this;
    }

    /**
     * 绘制非单调的平滑线
     */
     drawGraphics(
        ctx,
        points=[],
        smooth=0.5,
        smoothMonotone= 'x' | 'y' | 'none'
    ) {

        let start = 0;
        let dir=1;
        let segLen = points.length;

        let prevX;
        let prevY;
        let cpx0;
        let cpy0;
        let cpx1;
        let cpy1;
        let idx = start;

        let beginPath = false;

        let k = 0;
        
        for (; k < segLen; k++) {
            
            let point = points[idx];
            
            if (!_Math.isValibPoint( point )) {
                //如果发现是空点，那么就跳过，同时吧 beginPath 设置为false，代表一个path已经结束
                idx += dir;
                beginPath = false;
                continue;
            }

            let x = point[0];
            let y = point[1];

            if (!beginPath) {
                ctx.moveTo(x,y);
                cpx0 = x;
                cpy0 = y;
            } else {
                let dx = x - prevX;
                let dy = y - prevY;

                //忽略太过微小的片段
                if ((dx * dx + dy * dy) < 0.5) {
                    idx += dir;
                    continue;
                }

                if (smooth > 0) {
                    let nextIdx = idx + dir;
                    let nextPoint = points[nextIdx];
                    let nextX = nextPoint ? nextPoint[0] : null;
                    let nextY = nextPoint ? nextPoint[1] : null;
                    //忽略重复的点
                    while (nextX === x && nextY === y && k < segLen) {
                        k++;
                        nextIdx += dir;
                        idx += dir;

                        nextPoint = points[nextIdx];
                        nextX = nextPoint ? nextPoint[0] : null;
                        nextY = nextPoint ? nextPoint[1] : null;

                        x = points[idx][0];
                        y = points[idx][1];
                        dx = x - prevX;
                        dy = y - prevY;
                    }

                    let tmpK = k + 1;

                    let ratioNextSeg = 0.5;
                    let vx = 0;
                    let vy = 0;
                    let nextCpx0;
                    let nextCpy0;
                    // 最后一个点
                    if (tmpK >= segLen || !_Math.isValibPoint({x:nextX, y:nextY})) {
                        cpx1 = x;
                        cpy1 = y;
                    }
                    else {
                        vx = nextX - prevX;
                        vy = nextY - prevY;

                        const dx0 = x - prevX;
                        const dx1 = nextX - x;
                        const dy0 = y - prevY;
                        const dy1 = nextY - y;
                        let lenPrevSeg;
                        let lenNextSeg;
                        if (smoothMonotone === 'x') {
                            lenPrevSeg = Math.abs(dx0);
                            lenNextSeg = Math.abs(dx1);
                            const dir = vx > 0 ? 1 : -1;
                            cpx1 = x - dir * lenPrevSeg * smooth;
                            cpy1 = y;
                            nextCpx0 = x + dir * lenNextSeg * smooth;
                            nextCpy0 = y;
                        }
                        else if (smoothMonotone === 'y') {
                            lenPrevSeg = Math.abs(dy0);
                            lenNextSeg = Math.abs(dy1);
                            const dir = vy > 0 ? 1 : -1;
                            cpx1 = x;
                            cpy1 = y - dir * lenPrevSeg * smooth;
                            nextCpx0 = x;
                            nextCpy0 = y + dir * lenNextSeg * smooth;
                        }
                        else {
                            lenPrevSeg = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                            lenNextSeg = Math.sqrt(dx1 * dx1 + dy1 * dy1);

                            // seg长度的使用比例
                            ratioNextSeg = lenNextSeg / (lenNextSeg + lenPrevSeg);

                            cpx1 = x - vx * smooth * (1 - ratioNextSeg);
                            cpy1 = y - vy * smooth * (1 - ratioNextSeg);

                            // 下一段的cp0
                            nextCpx0 = x + vx * smooth * ratioNextSeg;
                            nextCpy0 = y + vy * smooth * ratioNextSeg;

                            // 点和下一个点之间的平滑约束。
                            // 平滑后避免过度极端。
                            nextCpx0 = mathMin(nextCpx0, mathMax(nextX, x));
                            nextCpy0 = mathMin(nextCpy0, mathMax(nextY, y));
                            nextCpx0 = mathMax(nextCpx0, mathMin(nextX, x));
                            nextCpy0 = mathMax(nextCpy0, mathMin(nextY, y));
                            // 根据下一段调整后的 cp0 重新回收 cp1。
                            vx = nextCpx0 - x;
                            vy = nextCpy0 - y;

                            cpx1 = x - vx * lenPrevSeg / lenNextSeg;
                            cpy1 = y - vy * lenPrevSeg / lenNextSeg;

                            // 点和上一个点之间的平滑约束。
                            // 平滑后避免过度极端。
                            cpx1 = mathMin(cpx1, mathMax(prevX, x));
                            cpy1 = mathMin(cpy1, mathMax(prevY, y));
                            cpx1 = mathMax(cpx1, mathMin(prevX, x));
                            cpy1 = mathMax(cpy1, mathMin(prevY, y));

                            //再次調整下一個cp0。
                            vx = x - cpx1;
                            vy = y - cpy1;
                            nextCpx0 = x + vx * lenNextSeg / lenPrevSeg;
                            nextCpy0 = y + vy * lenNextSeg / lenPrevSeg;
                        }
                    }

                    ctx.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, x, y);

                    cpx0 = nextCpx0;
                    cpy0 = nextCpy0;
                } else {
                    ctx.lineTo(x, y);
                }
            }

            prevX = x;
            prevY = y;
            idx += dir;

            beginPath = true;
        }

        return k;
    }
}