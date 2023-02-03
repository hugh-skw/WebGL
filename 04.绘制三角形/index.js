// 顶点着色器程序
const VSHADER_SOURCE = `   
    attribute vec4 a_Position;
    // attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        // gl_PointSize = a_PointSize;        
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