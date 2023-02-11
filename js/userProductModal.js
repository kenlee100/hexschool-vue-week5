import config from './config.js';
export default {
  data() {
    return {
      modal: {},
      tempContent: {
        imagesUrl: [],
      },
      qty: 1, // 初始數量變數
    };
  },
  // 當 id 變動時，取得遠端資料，並呈現 modal
  props: {
    id: {
      type: String,
      default: '',
    },

    addCart: {
      type: Function,
      default() {},
    },
    openModal: {
      type: Function,
      default() {},
    },
  },
  methods: {
    // 給外層用
    closeModal() {
      this.modal.hide();
    },
  },
  watch: {
    // 監聽外層傳進來的 id
    id() {
      // 取得單筆商品資訊;
      if (this.id) {
        axios
          .get(`${config.url}/api/${config.path}/product/${this.id}`)
          .then((res) => {
            this.tempContent = res.data.product;
            this.modal.show();
          })
          .catch((err) => {
            alert(`${err.data.message}`);
          });
      }
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
                            <img v-if="tempContent.imageUrl" class="img-fluid" :src="tempContent.imageUrl" alt="">
                            <img v-else class="img-fluid" src="https://placehold.co/640x480?text=No+Photo" alt="">

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
    // 當modal關閉時的事件
    this.$refs.modal.addEventListener('hidden.bs.modal', () => {
      // 將數量設為 1，避免設定數量，在關閉modal後又再次開啟modal時，顯示上一個數量
      this.qty = 1;
      // 設定modal id為空
      this.openModal('');
    });
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
