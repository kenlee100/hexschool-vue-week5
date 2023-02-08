import config from "./config.js";
import useProductModal from "./userProductModal.js";
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
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      sendButtonDisabled: true,
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
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    openModal(content) {
      this.loadingStatus.loadingItem = content.id;
      this.tempProduct = content;
      this.productId = content.id;
    },
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
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    // 刪除單筆購物車
    async deleteCartItem(content) {
      this.loadingStatus.loadingItem = content.id;
      try {
        const res = await axios.delete(
          `${config.url}/api/${config.path}/cart/${content.id}`
        );
        this.loadingStatus.loadingItem = "";
        await this.getCartList();
        const {
          // 取出內層的資料
          product: { title },
        } = content;
        const { message } = res.data;
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
          const res = await axios.delete(
            `${config.url}/api/${config.path}/carts`
          );
          await this.getCartList();
          const { message } = res.data;
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
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請填入正確的手機號碼";
    },
    // 建立訂單
    createOrder() {
      const order = this.form;
      axios
        .post(`${config.url}/api/${config.path}/order`, {
          data: order,
        })
        .then((res) => {
          //解構賦值
          const { message, orderId } = res.data;
          alert(` ${message} ，訂單編號 ${orderId}`);
          this.$refs.form.resetForm();
          this.getCartList();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
  },
  mounted() {
    this.isLoading = true;
    this.getProducts();
    this.getCartList();
  },
});
app.component("loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

// 定義規則
// 全部加入(CDN 版本)
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 加入多國語系
VeeValidateI18n.loadLocaleFromURL("./locale/zh_TW.json");
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount("#app");
