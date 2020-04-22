Page({
    onReady: function() {
        this.position = {
            x: 150,
            y: 150,
            vx: 2,
            vy: 2
        }

        // console.log(this);
//		setTimeout(this.draw2, 1000)
//         this.drawBall()
//         this.interval = setInterval(this.drawBall, 17)
        this.draw2();
    },
    draw: function() {
        const ctx = wx.createCanvasContext('myCanvas')

        // Draw coordinates
        ctx.arc(100, 75, 50, 0, 2 * Math.PI)
        ctx.setFillStyle('#EEEEEE')
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(40, 75)
        ctx.lineTo(160, 75)
        ctx.moveTo(100, 15)
        ctx.lineTo(100, 135)
        ctx.setStrokeStyle('#AAAAAA')
        ctx.stroke()

        ctx.setFontSize(12)
        ctx.setFillStyle('black')
        ctx.fillText('0', 165, 78)
        ctx.fillText('0.5*PI', 83, 145)
        ctx.fillText('1*PI', 15, 78)
        ctx.fillText('1.5*PI', 83, 10)

        // Draw points
        ctx.beginPath()
        ctx.arc(100, 75, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('lightgreen')
        ctx.fill()

        ctx.beginPath()
        ctx.arc(100, 25, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('blue')
        ctx.fill()

        ctx.beginPath()
        ctx.arc(150, 75, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('red')
        ctx.fill()

        // Draw arc
        ctx.beginPath()
        ctx.arc(100, 75, 50, 0, 1.5 * Math.PI)
        ctx.setStrokeStyle('#333333')
        ctx.stroke()

        ctx.draw()
    },
	draw2:function () {
//		const ctx = wx.createCanvasContext('myCanvas')
//		
//		wx.downloadFile({
//		  url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
//		  success(res) {
//		    ctx.save()
//		    ctx.beginPath()
//		    ctx.arc(50, 50, 25, 0, 2 * Math.PI)
//		    ctx.clip()
//		    ctx.drawImage(res.tempFilePath, 25, 25)
//		    ctx.restore()
//		    ctx.draw()
//		  }
//		})

const ctx = wx.createCanvasContext('myCanvas')

// Create circular gradient
const grd = ctx.createLinearGradient(30, 10, 120, 10)
grd.addColorStop(0, 'red')
grd.addColorStop(0.16, 'orange')
grd.addColorStop(0.33, 'yellow')
grd.addColorStop(0.5, 'green')
grd.addColorStop(0.66, 'cyan')
grd.addColorStop(0.83, 'blue')
grd.addColorStop(1, 'purple')

// Fill with gradient
ctx.setFillStyle(grd)
ctx.fillRect(10, 10, 150, 80)
ctx.draw()
	},
    drawBall: function() {
        var p = this.position
        p.x += p.vx
        p.y += p.vy
        if (p.x >= 300) {
            p.vx = -2
        }
        if (p.x <= 7) {
            p.vx = 2
        }
        if (p.y >= 300) {
            p.vy = -2
        }
        if (p.y <= 7) {
            p.vy = 2
        }

        var context = wx.createContext()

        function ball(x, y) {
            context.beginPath(0)
            context.arc(x, y, 5, 0, Math.PI * 2)
            context.setFillStyle('#1aad19')
            context.setStrokeStyle('rgba(1,1,1,0)')
            context.fill()
            context.stroke()
        }

        ball(p.x, 150)
        ball(150, p.y)
        ball(300 - p.x, 150)
        ball(150, 300 - p.y)
        ball(p.x, p.y)
        ball(300 - p.x, 300 - p.y)
        ball(p.x, 300 - p.y)
        ball(300 - p.x, p.y)
		
		this.draw(context);

        wx.drawCanvas({
            canvasId: 'myCanvas',
            actions: context.getActions()
        })
    },
    onUnload: function() {
        clearInterval(this.interval)
    }
})