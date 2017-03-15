
export function hex2rgb(hex, out){
    out = out || [];

    out[0] = ((hex >> 16) & 0xFF) / 255;
    out[1] = ((hex >> 8) & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;

    return out;
}

export function hex2string(hex){
     hex = hex.toString(16);
     hex = '000000'.substr(0, 6 - hex.length) + hex;

     return `#${hex}`;
}

export function rgb2hex(rgb){
	return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255));
}