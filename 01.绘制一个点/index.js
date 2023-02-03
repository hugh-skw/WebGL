// 顶点着色器程序
const VSHADER_SOURCE = `
    void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // 养成习惯，写 float 类型，不要写 int 型
        gl_PointSize = 50.0;        
    }
`

// 片元着色器程序
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`