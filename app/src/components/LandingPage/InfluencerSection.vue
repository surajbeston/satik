<template>
  <div class="py-8 influencer_section">
    <h1 class="font-inria-sans font-semibold text-[24px] py-6">
      Influencer Spotlights
    </h1>
    <div class="grid-container relative py-8">
      <!-- solana  logo -->
      <div
        class="absolute z-10 bg-primary-50 rounded-2xl p-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <img
          class="solana_logo"
          src="../../assets/icons/solana.png"
          alt="solana"
        />
      </div>
      <!-- solana logp ends -->
      <div class="div1 rounded-3xl group overflow-hidden relative">
        <img
          class="group-hover:scale-[1.1]"
          src="https://framerusercontent.com/images/jMegfKZc3HokUv2Z1RVrTGCTBco.jpg?scale-down-to=1024"
          alt="Influencer"
        />
        <div
          class="absolute group-hover:translate-y-0 duration-500 rounded-3xl delay-75 translate-y-full top-0 left-0 p-4 bg-black/60 w-full h-full"
        >
          <div class="flex justify-between items-center pb-4">
            <h1
              class="text-2xl font-oswald font-semibold -translate-x-full group-hover:translate-x-0 duration-300 delay-300 bg-gradient-to-r from-secondaryLight-10 to-secondaryLight-50 bg-clip-text text-transparent"
            >
              Saurav Niraula
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              class="fill-primaryLight-40 cursor-pointer hover:fill-primaryLight-70 duration-200 opacity-30 group-hover:opacity-100 group-hover:delay-500"
              viewBox="0 0 30 30"
            >
              <path
                d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"
              ></path>
            </svg>
          </div>
          <p
            class="font-oswald font-normal text-neutral-10 text-base py-2 opacity-30 group-hover:opacity-100 delay-300"
          >
            Content Creator - Youtube
          </p>

          <button
            class="text-lg font-inria-sans hover:bg-secondary-20 bg-secondary-30 px-4 py-2 rounded-3xl font-bold mt-4 opacity-30 group-hover:opacity-100 delay-300"
          >
            Initiate Contract
          </button>
        </div>
      </div>
      <div class="div2 rounded-3xl overflow-hidden">
        <img
          src="https://framerusercontent.com/images/yvAyCZxO6J0F7ygdLdbqOOpFFtA.jpg?scale-down-to=1024"
          alt="Influencer"
        />
      </div>
      <div class="div3 rounded-3xl overflow-hidden">
        <img
          src="https://framerusercontent.com/images/JGZI7KIb7x7FpdmOwVQj5Jlxea4.jpg?scale-down-to=512"
          alt="Influencer"
        />
      </div>
      <div class="div4 rounded-3xl overflow-hidden relative">
        <div
          class="absolute top-0 left-0 w-full h-full bg-black/60 p-4 flex justify-center items-center"
        >
          <button
            class="text-xl font-bold capitalize font-oswald text-secondary-0 underline underline-offset-[6px] hover:text-secondary-20 duration-200"
          >
            see more
          </button>
        </div>
        <img
          src="https://framerusercontent.com/images/0UUOBBAtJfhMAFXVuuTILoRxKc.jpg?scale-down-to=1024"
          alt="Influencer"
        />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
/* .influencer_section {
  cursor:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>👆</text></svg>")
      16 0,
    auto;
} */
.grid-container {
  width: 100%;
  height: 600px;
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
}
.div1 {
  grid-area: 1 / 1 / 3 / 3;
  background: #a3a;
}
.div2 {
  grid-area: 3 / 1 / 6 / 3;
  background: #4e4e;
}
.div4 {
  grid-area: 4 / 3 / 6 / 5;
  background: #4e4e4e;
}
.div3 {
  grid-area: 1 / 3 / 4 / 5;
  background: #dddd;
}
.div1 img,
.div2 img,
.div3 img,
.div4 img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: inherit;

  transition: all 0.6s ease-in-out;
}

.solana_logo {
  filter: linear-gradient(
    135deg,
    rgba(255, 116, 217, 0.6),
    rgba(255, 255, 153, 0.6) 40%,
    rgba(112, 219, 255, 0.6) 80%,
    rgba(112, 243, 255, 0.6)
  );
  animation: zoomInOut 0.8s ease-in-out 0s infinite alternate none;
}
@keyframes zoomInOut {
  0% {
    scale: 1;
  }
  50% {
  }
  100% {
    scale: 1.1;
  }
}
</style>
