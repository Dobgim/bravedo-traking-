export default function CartSidebar() {
  return (
    <>
      <div id="pxl-cart-sidebar" className="pxl-popup-wrap">
        <div className="pxl-popup--overlay pxl-cursor--cta"></div>
        <div className="pxl-popup--conent pxl-widget-cart-sidebar">
          <div className="widget_shopping_cart">
            <div className="widget_shopping_head">
              <div className="pxl-item--close pxl-close pxl-cursor--cta"></div>
              <div className="widget_shopping_title">
                {" Cart "}
                <span className="widget_cart_counter">(0 items)</span>
              </div>
            </div>
            <div className="widget_shopping_cart_content">
              <ul className="cart_list product_list_widget">
                <li className="empty">
                  <i className="caseicon-shopping-cart-alt"></i>
                  {" "}
                  <span>Your cart is empty</span>
                  {" "}
                  <a className="btn btn-shop" href="/">Browse Shop</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div id="pxl-cart-sidebar" className="pxl-popup-wrap">
        <div className="pxl-popup--overlay pxl-cursor--cta"></div>
        <div className="pxl-popup--conent pxl-widget-cart-sidebar">
          <div className="widget_shopping_cart">
            <div className="widget_shopping_head">
              <div className="pxl-item--close pxl-close pxl-cursor--cta"></div>
              <div className="widget_shopping_title">
                {" Cart "}
                <span className="widget_cart_counter">(0 items)</span>
              </div>
            </div>
            <div className="widget_shopping_cart_content">
              <ul className="cart_list product_list_widget">
                <li className="empty">
                  <i className="caseicon-shopping-cart-alt"></i>
                  {" "}
                  <span>Your cart is empty</span>
                  {" "}
                  <a className="btn btn-shop" href="/">Browse Shop</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
