// 產品列表 ✓
// 單一產品細節 ✓
// 加入購物車 ✓
// 購物車列表 ✓
// 刪除購物車項目（單一、全部） ✓
// 調整購物車產品數量 ✓
// vue-loading ✓
// 結帳付款

import config from "./config.js";
import useProductModal from "./userProductModal.js";
// import loading from "./vueLoading.js";
const app = Vue.createApp({
  data() {
    return {
      isLoading: false,
      loadingStatus: {
        loadingItem: "",
      },
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      productId: "",
      cart: {},
    };
  },
  components: {
    useProductModal,
  },
  methods: {
    // 取得全部商品
    getProducts() {
      axios
        .get(`${config.url}/api/${config.path}/products`)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
          console.log(res);
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    openModal(id) {
      this.loadingStatus.loadingItem = id;
      this.productId = id;
      console.log("productId 外層傳入", id);
    },
    // 取得單筆商品資訊
    // getProductItem(id) {
    //   // 將商品id寫入讀取狀態內容
    //   this.loadingStatus.loadingItem = id;
    //   axios
    //     .get(`${config.url}/api/${config.path}/product/${id}`)
    //     .then((res) => {
    //       this.loadingStatus.loadingItem = "";
    //       this.tempProduct = res.data.product;
    //       this.$refs.modal.openModal(id);
    //     })
    //     .catch((err) => {
    //       alert(`${err.data.message}`);
    //     });
    // },
    // 加入購物車
    addCart(content, qty = 1) {
      this.loadingStatus.loadingItem = content.id;
      axios
        .post(`${config.url}/api/${config.path}/cart`, {
          data: {
            product_id: content.id,
            qty,
          },
        })
        .then((res) => {
          this.loadingStatus.loadingItem = "";
          //解構賦值
          const {
            message,
            // 取出內層的資料
            data: { product },
          } = res.data;
          alert(`${product.title} ${message}`);
          this.$refs.modal.closeModal();
          this.getCartList();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    // 取得購物車
    getCartList() {
      axios
        .get(`${config.url}/api/${config.path}/cart`)
        .then((res) => {
          this.cart = res.data.data;
          console.log(res);
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    // 刪除單筆購物車
    async deleteCartItem(content) {
      this.loadingStatus.loadingItem = content.id;
      console.log("content", content);
      try {
        // console.log(1);
        const res = await axios.delete(
          `${config.url}/api/${config.path}/cart/${content.id}`
        );
        // console.log(2);
        this.loadingStatus.loadingItem = "";
        await this.getCartList();
        const {
          // 取出內層的資料
          product: { title },
        } = content;
        const { message } = res.data;
        // console.log(3);
        alert(`${title} ${message}`);
      } catch (err) {
        alert(`${err.data.message}`);
      }
    },
    // 清除購物車
    async clearCartItem() {
      const dialog = confirm("確定清除購物車嗎？");
      if (dialog) {
        try {
          // console.log(1);
          const res = await axios.delete(
            `${config.url}/api/${config.path}/carts`
          );
          // console.log(2);
          await this.getCartList();
          const { message } = res.data;
          // // console.log(3);
          setTimeout(() => {
            alert(`${message} 購物車`);
          }, 500);
        } catch (err) {
          alert(`${err.data.message}`);
        }
      }
    },
    // 修改購物車數量
    async updateCart(content) {
      //   console.log(content.id, content.product_id, qty);
      this.loadingStatus.loadingItem = content.id;
      try {
        const res = await axios.put(
          `${config.url}/api/${config.path}/cart/${content.id}`,
          {
            data: {
              product_id: content.product_id,
              qty: content.qty,
            },
          }
        );
        this.loadingStatus.loadingItem = "";
        await this.getCartList();
        const {
          // 取出內層的資料
          product: { title },
        } = content;
        alert(`已更新 品名：${title} 數量`);
      } catch (error) {
        alert(`${err.data.message}`);
      }
    },
    async viewProduct(id) {
      //   console.log(1);
      await this.getProductItem(id);
      console.log(Object.keys(this.tempProduct).length > 1);
      // if (Object.keys(this.tempProduct).length > 1) {
      //   this.$refs.modal.openModal();
      // }
      //   console.log(2);
      //   console.log(3);
    },
  },
  mounted() {
    this.isLoading = true;
    this.getProducts();
    this.getCartList();
  },
});
console.log(VueLoading);
// app.use(VueLoading.LoadingPlugin);
app.component("loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
VeeValidateI18n.loadLocaleFromURL("./locale/zh_TW.json");
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount("#app");
