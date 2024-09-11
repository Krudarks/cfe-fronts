/** @type {import('tailwindcss').Config} */
module.exports = {
    content:[
        './src/**/*.{html,ts}',
        "./node_modules/flowbite/**/*.js" // add this line
    ],
    // enable dark mode via class strategy
    darkMode:'class',
    theme:{
        extend:{
            keyframes: {
                'slide-in': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(0)' }
                }
            },
            animation: {
                'slide-in': 'slide-in 0.5s ease-in-out'
            },
            colors:{
                primary:{
                    '50':'#edfff4',
                    '100':'#d5ffe6',
                    '200':'#aeffce',
                    '300':'#70ffaa',
                    '400':'#2bfd7e',
                    '500':'#00dd58',
                    '600':'#00c048',
                    '700':'#00963c',
                    '800':'#067533',
                    '900':'#07602d',
                    '950':'#003717',
                },
                // 'dark-theme': '#424242',
            }
        },
        fontFamily:{
            'body':[
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            'sans':[
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ]
        },
    },
    plugins:[
        require('flowbite/plugin')({
            charts: true,
        }),
    ],
};

