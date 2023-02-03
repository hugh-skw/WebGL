const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;      // 别忘记
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`