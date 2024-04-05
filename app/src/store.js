import { reactive } from 'vue'

export const store = reactive({
    products: [{id: 1, productImage: "", productName: "", influencerAmount: 0, totalAmount: 0, productDescription: ""}],
    currentUserLoaded: false,
    currentUserType: "",
    currentUser: null
})