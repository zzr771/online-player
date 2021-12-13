// "发现音乐"页面顶部的轮播图组件
<template>
  <div class="banner">
    <swiper
      :initial-slide="2"
      :slides-per-view="2"
      :centered-slides="true"
      :space-between="0"
      :navigation="true"
      :loop="true"
      :pagination="{ clickable: true }"
    >
      <!-- :autoplay="{ delay: 3000, disableOnInteraction: false }" 
       -->
      <swiper-slide
        v-for="(banner, index) in banners"
        :key="index"
        :swiperIndex="index"
        @click="clickSlide(index)"
      >
        <a><img :src="banner.imageUrl" alt="" /></a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue"
import "swiper/swiper-bundle.css"
import { ref, reactive, nextTick } from "vue"
import { reqBanners } from "@/api/discovery"
SwiperCore.use([Navigation, Pagination, Autoplay])
export default {
  setup() {
    // swiper7似乎已经不支持将配置存放在变量并使用 <swiper :options="swiperOptions"> 方法引用
    //#region
    // const swiperOptions = reactive({
    //   slidesPerView: 2,
    //   centeredSlides: true,
    //   spaceBetween: 0,
    //   navigation: true,
    //   loop: true,
    //   speed: 500,
    //   pagination: {
    //     clickable: true,
    //   },
    //   autoplay: {
    //     delay: 3000,
    //     disableOnInteraction: false,
    //   },
    // })
    //#endregion
    // let swiper = new SwiperCore()
    let banners = reactive({})
    ;(async function getBanner() {
      let result = await reqBanners()
      banners = Object.assign(banners, result.banners)
      // console.log(banners)
      // 等待轮播图生成后执行初始化
      nextTick(() => {
        _initSwiper()
      })
    })()

    function _initSwiper() {
      /*
      需求: 当鼠标进入.swiper-slide-prev图片时,图片透明度为1.当鼠标进一步进入该图片
            上方的.swiper-button-prev按钮时,按钮变色, 但图片透明度依然为1
            这无法用:hover伪类实现,因为鼠标从图片进入按钮时,就会失去:hover.
    */
      let sideImgs = []
      sideImgs[0] = document.querySelector(".swiper-slide-next")
      sideImgs[1] = document.querySelector(".swiper-slide-prev")
      let btns = []
      btns[0] = document.querySelector(".swiper-button-next")
      btns[1] = document.querySelector(".swiper-button-prev")
      // 鼠标进入图片,添加on-hover类; 离开图片,去除on-hover类
      sideImgs.forEach((img) => {
        img.onmouseenter = () => {
          img.classList.add("on-hover")
        }
        img.onmouseleave = () => {
          img.classList.remove("on-hover")
        }
      })
      // 鼠标进入按钮,就给该按钮下方的图片添加on-hover类
      btns[0].onmouseenter = () => {
        sideImgs[0].classList.add("on-hover")
      }
      btns[1].onmouseenter = () => {
        sideImgs[1].classList.add("on-hover")
      }

      //鼠标进入轮播图, 再显示左右按钮
      const swiper = document.querySelector(".swiper")
      swiper.onmouseenter = () => {
        btns.forEach((btn) => {
          btn.style.setProperty("opacity", "1")
        })
      }
      swiper.onmouseleave = () => {
        btns.forEach((btn) => {
          btn.style.setProperty("opacity", "0")
        })
      }

      // 当鼠标悬浮在分页器上方时,触发该分页器的click事件,实现悬停切换
      let paginations = document.querySelectorAll(".swiper-pagination-bullet")
      paginations.forEach((pagination) => {
        pagination.onmouseenter = pagination.click
      })

      /*
        轮播图加载完毕后,再给轮播页添加transition属性
        如果直接把transition写在css里,那么轮播图出现的瞬间,图片的大小和位置都不是我们想要的,
          但由于transition的存在,图片就位的过程也会以动画的形式展现给用户,显得杂乱
        这里等待100ms后再给轮播图添加transition属性,该属性添加上的时候,轮播图已经就位完毕
      */
      setTimeout(() => {
        let swiperSlides = document.querySelectorAll(".swiper-slide")
        swiperSlides.forEach((swiperSlide) => {
          swiperSlide.style.setProperty("transition", "0.4s")
        })
      }, 100)
    }

    // 问题: 如果给slide中的图片包裹超链接, 那么点击两侧的图片时,会触发超链接.
    // 解决:不给图片添加超链接.当图片被点击时,检测它是否是当前展示的图片,如果是,就打开对应的url
    function clickSlide(index) {
      // 获取当前图片的index
      const slide = document.querySelector(`[swiperindex="${index}"]`)
      const activeClass = "swiper-slide-active"
      // 如果被点击的slide是当前处于中心展示的slide,就打开对应的链接
      if (slide.classList.contains("swiper-slide-active")) {
        // 如果存在对应的url
        if (banners[index].url) {
          window.open(banners[index].url)
        }
      }
      // 如果被点击的图片是两侧的图片,就切换过去.
      // 不能使用swiper自带的slideToClickedSlide属性. 用了它以后,点击左右两侧的图片,它们会立即获得swiper-slide-active类,这就干扰了上面的代码
      else {
        // 如果是左侧的图片,就让swiper向左切换一张. 右侧相同
        if (slide.classList.contains("swiper-slide-prev")) {
          const leftBtn = document.querySelector(".swiper-button-prev")
          leftBtn.click()
        } else {
          const rightBtn = document.querySelector(".swiper-button-next")
          rightBtn.click()
        }
      }
    }

    return { banners, clickSlide }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
}
</script>

<style lang="less">
.banner {
  position: relative;
  width: 100%;
  // 宽高都不要固定,让swiper自动缩放轮播图的框架的大小
  max-width: 936px;
  max-height: 230px;
  margin: 0 auto;
  .swiper {
    padding-top: 10px;
    padding-bottom: 30px;
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      // 这里不添加transition属性,而是在setup中动态添加(见上方注释)
      // transition: 0.3s;
      opacity: 0.7;
      &.on-hover {
        opacity: 1;
      }
      a {
        width: 100%;
        img {
          border-radius: 5px;
          width: 100%;
          /*
            加最大宽度是为了让轮播图出现时的动作不至于太夸张
          */
          max-width: 500px;
        }
      }
    }
    .swiper-slide-next {
      transform: translateX(-45%) scale(0.9);
    }
    .swiper-slide-prev {
      transform: translateX(45%) scale(0.9);
    }
    .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: scale(1.05);
      z-index: 800;
      opacity: 1;
    }
    .swiper-button-prev,
    .swiper-button-next {
      position: absolute;
      top: 40%;
      width: 36px;
      height: $width;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      color: rgba(255, 255, 255, 0.9);
      transition: 0.3s;
      // 默认状态下不显示,当鼠标位于轮播图上时再显示
      opacity: 0;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    .swiper-button-prev::after,
    .swiper-button-next::after {
      font-size: 10px;
    }
    .swiper-pagination {
      position: absolute;
      bottom: 0px;
      .swiper-pagination-bullet {
        box-sizing: content-box;
        // 不让padding部分有背景色
        background-clip: content-box;
        width: 30px;
        height: 2px;
        padding: 10px 0;
        margin: 0 5px;
        border: none;
        border-radius: 0;
        background-color: #c0c4cc;
        .swiper-pagination-bullet-active {
          background-color: #c0c4cc;
        }
      }
    }
  }
}
</style>
