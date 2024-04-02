<template>
  <div>
    <div class="w-[80%] mx-auto py-16">
      <div class="flex gap-10 pb-8">
        <div class="w-1/2 h-[700px]">
          <img
            class="h-full w-[90%] object-cover"
            src="../assets/images/creator.jpg"
            alt=""
          />
        </div>
        <div class="w-1/2">
          <h1 class="text-5xl pt-2 pb-6 font-bold text-neutral-10">
            Suraj Bahadur Jha,userId->{{ $route.params.id }}
          </h1>
          <div class="py-9">
            <h3
              class="border-b pb-2 border-secondaryLight-0 text-xl font-semibold text-neutral-10"
            >
              About Me
            </h3>
            <p class="text-xl py-6 text-neutral-10 leading-8 font-normal">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Reprehenderit earum nulla debitis sit, magnam modi placeat porro
              officia, ipsum similique expedita quas, deleniti dolores possimus
              veritatis. Illum iusto blanditiis quibusdam? Lorem ipsum dolor sit
              amet consectetur adipisicing elit. A maxime voluptate distinctio
              vero est.
            </p>

            <ul class="flex gap-4 flex-col py-6">
              <CreatorContact
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
              />
            </ul>
            <button
              @click="$router.push(`/contract/${$route.params.id}`)"
              class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
            >
              Initiate Contract
            </button>
          </div>
        </div>
      </div>
      <div class="bg-primary-80 flex gap-6 p-8 my-8">
        <CreatorStat
          :stat="{ number: '80K', description: 'Average Followers' }"
        />
        <CreatorStat :stat="{ number: '8.5K', description: 'Average Reach' }" />
        <CreatorStat
          :stat="{ number: '78K', description: 'Average Impression' }"
        />
        <CreatorStat
          :stat="{ number: '87%', description: 'Engagement Rate' }"
          :border="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CreatorStat from "../components/creatorProfile/CreatorStat.vue";
import CreatorContact from "../components/creatorProfile/CreatorContact.vue";

const contacts = [
  {
    id: 1,
    iconUrl: "/src/assets/icons/call.svg",
    contactText: "+91 1234567890",
  },
  {
    id: 2,
    iconUrl: "/src/assets/icons/mail.svg",
    contactText: "nGnFj@example.com",
  },
  {
    id: 3,
    iconUrl: "/src/assets/icons/location.svg",
    contactText: "Mumbai, India",
  },
];
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
</script>

<style scoped></style>
