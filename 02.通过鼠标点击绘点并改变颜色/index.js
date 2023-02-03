const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;        // precision 是精度限定词，用来指定变量的范围（最大值与最小值）和精度， mediump 表示中等精度
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`