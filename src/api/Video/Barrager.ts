import { getPixelRatio } from '@/util/index'

interface Barrage {
    left?: number
    width?: number
    top?: number
    color?: string
    value: string
    occupation?: boolean
    offset?: number
}

export class Barrager {
    private canvas: HTMLCanvasElement;
    private context: any
    private cHeight: number
    private cWidth: number
    public barrageList: Barrage[]//工作列表，存放即刻要绘制的弹幕
    private textList: Barrage[]//弹幕缓冲区
    private fontSize: number
    private highwayAmount: number[]
    private draw: boolean
    public pauseFlag: boolean = false

    constructor(e: HTMLCanvasElement, fontSize: number) {
        this.canvas = e
        this.context = this.canvas.getContext("2d")
        //根据像素比缩放或扩大画布渲染区域
        this.cHeight = this.canvas.offsetHeight * getPixelRatio(this.context)
        this.cWidth = this.canvas.offsetWidth * getPixelRatio(this.context)
        this.canvas.width = this.cWidth
        this.canvas.height = this.cHeight

        this.context.font = `${fontSize}px Microsoft YaHei`
        this.barrageList = [];
        this.textList = []
        this.fontSize = fontSize
        this.highwayAmount = []
        this.initTop()
        this.draw = false
    }
    initTop() {
        const maxHighwayAmount = Math.floor(this.cHeight / (this.fontSize + 5))
        for (let i = 1; i <= maxHighwayAmount; i++) {
            this.highwayAmount.push((this.fontSize + 5) * i)
        }
    }
    drawBarrage() {
        this.context.clearRect(0, 0, this.cWidth, this.cHeight)
        for (let i = 0; i < this.barrageList.length; i++) {
            this.barrageList[i].left + this.barrageList[i].width <= 0 ? this.barrageList.splice(i, 1) : ''
        }
        //绘制弹幕
        this.barrageList.forEach((val) => {
            this.context.fillStyle = val.color
            this.context.fillText(`${val.value}`, val.left, val.top)
            val.occupation && val.left + val.width <= this.cWidth ? this.consumeText(val) : ''
            val.left -= 2
        })
        if (this.pauseFlag) {
            this.barrageList.length == 0 ? this.draw = false : requestAnimationFrame(this.drawBarrage.bind(this))//这一句右半就是每帧都调用的绘画函数
        }
    }
    consumeText(val: Barrage) {
        //将占用标志置为false，防止多次执行
        val.occupation = false
        //释放top值，向this.highwayAmount返回占用的top值,延迟0.5s执行，防止弹幕粘黏
        setTimeout(() => {
            this.highwayAmount.push(val.top)
            if (this.textList.length != 0) {
                this.barrageList.push(this.initTest(this.textList.splice(0, 1)[0]))
            }
        }, 500)
    }
    initTest(e: Barrage) {
        let barrageTest = {
            value: e.value,
            top: this.highwayAmount.splice(0, 1)[0],
            left: this.cWidth,
            color: '#fff',
            offset: Math.ceil(Math.random() * 3),
            width: Math.ceil(this.context.measureText(e).width),
            occupation: true,
        }
        return barrageTest
    }
    public addBarrage(textList: Barrage[]) {
        if (this.draw) {
            if (this.highwayAmount.length != 0) {
                //将数量为highwayAmount.length条待发送弹幕推入工作列表
                let tList = textList.splice(0, this.highwayAmount.length)
                for (const val of tList) {
                    this.barrageList.push(this.initTest(val))
                }
            }
            //剩下的放入缓冲区
            this.textList = this.textList.concat(textList);
        } else {
            this.textList = this.textList.concat(textList);
            this.draw = true
            this.runBarrage()
        }
    }
    public runBarrage() {
        this.textList.splice(0, this.highwayAmount.length).forEach((val) => {
            this.barrageList.push(this.initTest(val))
        })
        this.drawBarrage()
    }
}