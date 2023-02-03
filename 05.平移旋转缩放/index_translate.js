// 顶点着色器程序
const VSHADER_SOURCE = `   
    attribute vec4 a_Position;
    uniform vec4 u_Translation;
    void main() {
        gl_Position = a_Position + u_Translation;
    }
`

// 片元着色器程序
const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`