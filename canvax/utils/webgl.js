var webgl = { 
    isWebGLSupported : function (){
        var contextOptions = { stencil: true };
        try
        {
            if (!window.WebGLRenderingContext) //不存在直接return
            {
                return false;
            }
            var canvas = document.createElement('canvas'), 
                gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
            return !!(gl && gl.getContextAttributes().stencil); //还要确实检测是否支持webGL模式
        }
        catch (e)
        {
            return false;
        }
    }
};

export default webgl;