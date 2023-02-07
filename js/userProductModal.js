import config from "./config.js";
export default {
  data() {
    return {
      modal: {},
      qty: 1, // 初始數量變數
    };
  },
  // 當 id 變動時，取得遠端資料，並呈現 modal
  props: {
    id: {
      type: String,
      default: "",
    },
    tempContent: {
      type: Object,
      default: {
        imagesUrl: [],
      },
    },
    addCart: {
      type: Function,
      default() {},
    },
    loadingStatus: {
      type: Object,
      default: {},
    },
  },
  methods: {
    // 給外層用
    openModal() {
      this.modal.show();
    },
    // 給外層用
    closeModal() {
      this.modal.hide();
    },
  },
  watch: {
    // 監聽外層傳進來的 id
    id() {
      // 取得單筆商品資訊;
      axios
        .get(`${config.url}/api/${config.path}/product/${this.id}`)
        .then((res) => {
          // 清除外層讀取狀態id
          this.loadingStatus.loadingItem = "";
          this.tempProduct = res.data.product;
          this.modal.show();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
  },
  template: `
        <div class="modal fade" tabindex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
            <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                    <span>{{ tempContent.title }}</span>
                </h5>
                <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
            </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <img class="img-fluid" :src="tempContent.imageUrl" alt="">
                        </div>
                        <div class="col-sm-6">
                            <span class="badge bg-primary rounded-pill">{{ tempContent.category  }}</span>
                            <p>商品描述：{{ tempContent.description }}</p>
                            <p>商品內容：{{ tempContent.content }}</p>
                            <div class="h5">{{ tempContent.price }} 元</div>
                            <del class="h6">原價 {{ tempContent.origin_price }} 元</del>
                            <div class="h5">現在只要 {{ tempContent.price }} 元</div>
                            <div>
                                <div class="input-group">
                                    <input type="number" class="form-control" min="1" v-model.number="qty">
                                    <button type="button" class="btn btn-primary" @click="addCart(tempContent, qty)">加入購物車</button>
                                </div>
                            </div>
                        </div>
                            <!-- col-sm-6 end -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      backdrop: "static",
      keyboard: false,
    });
  },
};
