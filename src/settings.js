export default {
    //设备分辨率
    RESOLUTION: 1,

    /**
     * Target frames per millisecond.
     */
    TARGET_FPMS: 0.06,

    /**
     * If set to true WebGL will attempt make textures mimpaped by default.
     * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
     */
    MIPMAP_TEXTURES: true,

    /**
     * Default filter resolution.
     */
    FILTER_RESOLUTION: 1,


    // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
    // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

    /**
     * The default sprite batch size.
     *
     * The default aims to balance desktop and mobile devices.
     */
    SPRITE_BATCH_SIZE: 4096,

    /**
     * The prefix that denotes a URL is for a retina asset.
     */
    RETINA_PREFIX: /@(.+)x/,

    RENDER_OPTIONS: {
        view: null,
        antialias: true,
        forceFXAA: false,
        autoResize: false,
        transparent: true,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        roundPixels: false,
    },

    TRANSFORM_MODE: 0,

    GC_MODE: 0,

    GC_MAX_IDLE: 60 * 60,

    GC_MAX_CHECK_COUNT: 60 * 10,

    WRAP_MODE: 0,

    SCALE_MODE: 0,

    PRECISION: 'mediump'

};
