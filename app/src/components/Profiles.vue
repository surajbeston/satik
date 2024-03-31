<template>
    <div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="profile in profiles" :key="profile" class="border-2 border-gray-300 rounded-md p-4">
                <div class="font-bold text-lg">{{profile.account.name}}</div>
                <div>{{profile.account.bio}}</div>
                <!-- <div>DOB: {{new Date(profile.account.dob).toLocaleDateString()}}</div> -->
                <div><img :src="profile.account.picture" alt="profile picture" class="w-24 h-24"/></div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useWallet } from 'solana-wallets-vue';
import { ref, onMounted } from 'vue';
import { initWorkspace } from "../../anchor/useWorkspace.js";
import {Keypair} from "@solana/web3.js";


const profiles = ref([]);

async function getProfiles() {
    const {publicKey} = useWallet();
    const {program, connection} =  initWorkspace();
    console.log(program.value)
    console.log(connection)

    try{
        const remoteProfiles = await program.value.account.profile.all();

        profiles.value = remoteProfiles;
        console.log(profiles.value);
    }
    catch(err) {
        console.log(err);
    }
}

onMounted(() => {
    getProfiles()
})

</script>