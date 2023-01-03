const sharp = require('sharp');
module.exports = (client) => {

    client.createBanner = async (imageBuffer,avatarURL,userTag, userNumber) => {
        const metadata = await sharp(imageBuffer).metadata();
        const { entropy, sharpness, dominant } = await sharp(imageBuffer).stats();
        const { r, g, b } = dominant;

        const width = metadata.width;
        const height = metadata.height;
        const text = "Welcome!";

        const gradientImage = `
        <svg width="${parseInt(width)}" height="${parseInt(height)}">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="10%" style="stop-opacity:0" />
                    <stop offset="300%" style="stop-color:rgb(${r},${g},${b});stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="${parseInt(width)}" height="${parseInt(height)}" fill = "url(#grad1)"/>
        </svg>
        `;

        const gradientBuffer = Buffer.from(gradientImage);

        // Cut avatar into circle
        const circleSvgimage = `
            <svg>
            <circle cx="${parseInt(height/2)/2}" cy="${parseInt(height/2)/2}" r="${parseInt(height/2)/2}"/>
            </svg>
        `;
        const circleSvgBuffer = Buffer.from(circleSvgimage);

        // Avatar border
        const borderThickness = 40;
        const borderSvgimage = `
            <svg width = "${parseInt(height/borderThickness)+parseInt(height/2)}" height = "${parseInt(height/30)+parseInt(height/2)}">
            <circle cx="50%" cy="50%" r="${parseInt(height/2)/2}" stroke = "rgb(${parseInt(255-(0.5*(255-r)))},${parseInt(255-(0.5*(255-g)))},${parseInt(255-(0.5*(255-b)))})" fill = "none" stroke-width = "${parseInt(height/borderThickness)}"/>
            </svg>
        `;
        const borderSvgBuffer = Buffer.from(borderSvgimage);

        const resizeAvatar = await sharp(avatarURL)
            .resize(
            {
                width : parseInt(height/2),
                height : parseInt(height/2)
            }
            )
            .composite([
            {
                input:circleSvgBuffer,
                blend:"dest-in",
                gravity:"centre"
            },
            ]
            )
            .png()
            .toBuffer();
        const bufferAvatar = Buffer.from(resizeAvatar);

        const svgImage = `
        <svg width="${parseInt(width)}" height="${parseInt(height)}">

            <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
            <style>
            @font-face {
                font-family: 'Alfa Slab One';
                src: url('./AlfaSlabOne-Regular.ttf') format('truetype');
            }
            
            @font-face {
                font-family: 'Coustard';
                src: url('./Coustard-Regular.ttf') format('truetype');
            }
            .shadow {
                font-family:"Alfa Slab One"; 
                fill: black;
                font-size: ${parseInt(height/9)}px;
            }
            .title {
                font-family:"Alfa Slab One"; 
                fill: white;
                font-size: ${parseInt(height/9)}px;
            }
            .shadow-handle {
                font-family:"Coustard"; 
                fill: black;
                font-size: ${parseInt(height/15)}px;
            }
            .handle {
                font-family:"Coustard"; 
                fill: white;
                font-size: ${parseInt(height/15)}px;
            }
            .shadow-number {
                font-family:"Coustard"; 
                fill: black;
                font-size: ${parseInt(height/20)}px;
            }
            .number {
                font-family:"Coustard"; 
                fill: white;
                font-size: ${parseInt(height/20)}px;
            }
            </style>

            <text x="50%" y="75%" text-anchor="middle" class="shadow" filter="url(#f1)">${text}</text>
            <text x="50%" y="83.5%" text-anchor="middle" class="shadow-handle" filter="url(#f1)">${userTag}</text>
            <text x="50%" y="90%" text-anchor="middle" class="shadow-number" filter="url(#f1)"> You are the ${userNumber}th member!</text>

            <text x="50%" y="75%" text-anchor="middle" class="shadow" filter="url(#f1)">${text}</text>
            <text x="50%" y="83.5%" text-anchor="middle" class="shadow-handle" filter="url(#f1)">${userTag}</text>
            <text x="50%" y="90%" text-anchor="middle" class="shadow-number" filter="url(#f1)"> You are the ${userNumber}th member!</text>

            <text x="50%" y="75%" text-anchor="middle" class="title" >${text}</text>
            <text x="50%" y="83.5%" text-anchor="middle" class="handle" >${userTag}</text>
            <text x="50%" y="90%" text-anchor="middle" class="number" > You are the ${userNumber}th member!</text>

            </svg>
        `;
        console.log(svgImage);
        const svgBuffer = Buffer.from(svgImage);

        const resizedImage = await sharp(imageBuffer)
            .composite([
                {
                    input: gradientBuffer,
                    // gravity:"centre"
                },
                {
                    input: bufferAvatar,
                    top: parseInt(0.35*height-height/4),
                    left: parseInt(0.5*width-height/4),
                },
                {
                    input: borderSvgBuffer,
                    top: parseInt(0.35*height-(parseInt(height/borderThickness)+parseInt(height/2))/2),
                    left: parseInt(0.5*width-(parseInt(height/borderThickness)+parseInt(height/2))/2),
                },
                {
                    input: svgBuffer,
                    // gravity:"centre"
                }
            ])
            .jpeg({quality:70})
            .toBuffer();
        console.log(resizedImage);
        return resizedImage;
    }
}
