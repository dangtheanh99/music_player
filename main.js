// steps to do
/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

// Lam tuan tu tung buoc
// Lam tu de toi kho


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'My Love',
            image: "./img/westlife.jpg",
            path: "./music/MyLove.mp3",
            singer: 'Westlife'
        },
        {
            name: 'A Thousand Years',
            image: "./img/christinaperri.jpg",
            path: "./music/AThousandYears.mp3",
            singer: 'Christina Perri'
        },
        {
            name: 'Beautiful In White',
            image: "./img/shanefilan.jpg",
            path: "./music/BeautifulInWhite.mp3",
            singer: 'Shane Filan'
        },
        {
            name: 'Dynamite',
            image: "./img/bts.jpeg",
            path: "./music/Dynamite.mp3",
            singer: 'BTS'
        },
        {
            name: 'I Love You 3000',
            image: "./img/iloveyou3000.jpg",
            path: "./music/ILoveYou3000.mp3",
            singer: 'Stephanie Poetri'
        },
        {
            name: 'Let Me Love You',
            image: "./img/justin.jpg",
            path: "./music/LetMeLoveYou.mp3",
            singer: 'Justin Bieber'
        },
        {
            name: 'Payphone',
            image: "./img/maroon5.jpg",
            path: "./music/Payphone.mp3",
            singer: 'Maroon 5'
        },
        {
            name: 'Photograph',
            image: "./img/edsheeran.jpg",
            path: "./music/Photograph.mp3",
            singer: 'Ed Sheeran'
        },
        {
            name: 'Talking To The Moon',
            image: "./img/bruromars.jpg",
            path: "./music/TalkingToTheMoon.mp3",
            singer: 'Bruro Mars'
        },
        {
            name: 'Unstoppable',
            image: "./img/sia.jpg",
            path: "./music/Unstoppable.mp3",
            singer: 'Sia'
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div
                    class="thumb"
                    style="
                        background-image: url(${song.image});
                    "
                    ></div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>      
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        // C???n ch???nh l???i ph???n x??? l?? vi???c thu ph??ng ????a CD
        const cdWidth = cd.offsetWidth        
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            var newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth            
        }
        // X??? l?? CD quay v?? d???ng quay khi ???n pause
        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 30000,  // Th???i gian quay trong 10 gi??y
            iterations: Infinity  // L???p v?? h???n
        })
        cdThumbAnimation.pause()

        // X??? l?? khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        // Khi song ???????c play 
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
        }
        // Khi song ???????c pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }
        // Khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }

        // X??? l?? tua b??i h??t
        progress.onchange = function(e) {
            // console.log(e.target.value)
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }
        // x??? l?? next b??i h??t
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // x??? l?? prev b??i h??t (quay l???i b??i tr?????c)
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // X??? l?? random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // X??? l?? ph??t l???i b??i h??t
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Next b??i khi k???t th??c b??i h??t
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // L???ng nghe h??nh vi khi click v??o playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                // X??? l?? khi click v??o song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // X??? l?? khi click v??o song option
                if (e.target.closest('.option')) {

                }
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block : 'end',
                // inline: 'nearest'
            }) 
        }, 200)
    },
    loadCurrentSong: function() {
        // console.log(heading, cdThumb, audio)
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        var newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // ?????nh ngh??a c??c thu???c t??nh cho object
        this.defineProperties()
        // L???ng nghe / x??? l?? c??c s??? ki???n
        this.handleEvents()
        // T???i th??ng tin b??i h??t ?????u ti??n khi ch???y ???ng d???ng
        this.loadCurrentSong()
        // Render playlist
        this.render()
    },


}

app.start()