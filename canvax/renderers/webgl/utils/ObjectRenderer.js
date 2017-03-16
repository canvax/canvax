
export default class ObjectRenderer
{
    constructor(renderer)
    {
        this.renderer = renderer;
    }

    start()
    {
        
    }

    stop()
    {
        this.flush();
    }

    flush()
    {
        
    }

    destroy()
    {
        this.renderer.off('context', this.onContextChange, this);

        this.renderer = null;
    }

    render(object) 
    {

    }
}
