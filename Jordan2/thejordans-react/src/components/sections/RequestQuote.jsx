export default function RequestQuote() {
  return (
    <div
      className="elementor-element elementor-element-7d503a7 e-flex e-con-boxed pxl-row-scroll-none pxl-column-none pxl-full-content-with-space-none pxl-container-line-none pxl-container-video-background-none pxl-none overflow-visible e-con e-parent "
      data-id="7d503a7"
      data-element_type="container"
      data-e-type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-f05971e e-con-full e-flex pxl-row-scroll-none pxl-column-none pxl-full-content-with-space-none pxl-container-line-none pxl-container-video-background-none pxl-none overflow-visible e-con e-child "
          data-id="f05971e"
          data-element_type="container"
          data-e-type="container"
          data-settings={"{\"background_background\":\"classic\"}"}
        >
          <div
            className="elementor-element elementor-element-6966561 e-con-full e-flex pxl-row-scroll-none pxl-column-none pxl-full-content-with-space-none pxl-container-line-none pxl-container-video-background-none pxl-none overflow-visible e-con e-child "
            data-id="6966561"
            data-element_type="container"
            data-e-type="container"
            data-settings={"{\"background_background\":\"classic\"}"}
          >
            <div
              className="elementor-element elementor-element-a39a6b6 pxl-none overflow-visible elementor-widget elementor-widget-pxl_heading"
              data-id="a39a6b6"
              data-element_type="widget"
              data-e-type="widget"
              data-widget_type="pxl_heading.default"
            >
              <div className="elementor-widget-container">
                <div id="pxl-pxl_heading-a39a6b6-6035" className="pxl-heading   px-sub-title-default-style ">
                  <div className="pxl-heading--inner">
                    <h3 className="pxl-item--title style-default color highlight-default " data-wow-delay="ms">{" Request a quote "}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-7c97cc8 pxl-none overflow-visible elementor-widget elementor-widget-pxl_contact_form"
              data-id="7c97cc8"
              data-element_type="widget"
              data-e-type="widget"
              data-widget_type="pxl_contact_form.default"
            >
              <div className="elementor-widget-container">
                <div className="pxl-contact-form pxl-contact-form1 btn-w-auto " data-wow-delay="ms">
                  <div className="wpcf7 no-js" id="wpcf7-f4308-p18-o1" lang="en-US" dir="ltr" data-wpcf7-id="4308">
                    <div className="screen-reader-response">
                      <p role="status" aria-live="polite" aria-atomic="true"></p>
                      <ul></ul>
                    </div>
                    <form
                      action="/contact"
                      method="post"
                      className="wpcf7-form init"
                      data-native-form="quote"
                      aria-label="Quote form"
                      data-status="init"
                    >
                      <input type="hidden" name="_token" defaultValue="FCxKgnqSGKZVsl1BXj4tRPguXqQjvq4v0NzppiGE" autoComplete="off" />
                      <div className="wrap-ctf-2 wrap-form">
                        <div className="containter">
                          <div className="row">
                            <div className="input-filled col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <label>Name*</label>
                              {" "}
                              <span className="wpcf7-form-control-wrap your-name">
                                <span className="wpcf7-form-control-wrap" data-name="your-name">
                                  <input
                                    size="40"
                                    maxLength="400"
                                    className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                    aria-required="true"
                                    aria-invalid="false"
                                    placeholder="Name"
                                    defaultValue=""
                                    type="text"
                                    name="your-name"
                                   />
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <span className="wpcf7-form-control-wrap your-email">
                                <span className="wpcf7-form-control-wrap" data-name="your-email">
                                  <input
                                    size="40"
                                    maxLength="400"
                                    className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email"
                                    aria-required="true"
                                    aria-invalid="false"
                                    placeholder="Email*"
                                    defaultValue=""
                                    type="email"
                                    name="your-email"
                                   />
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                              <span className="wpcf7-form-control-wrap your-phone">
                                <span className="wpcf7-form-control-wrap" data-name="your-phone">
                                  <input
                                    size="40"
                                    maxLength="400"
                                    className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel"
                                    aria-required="true"
                                    aria-invalid="false"
                                    placeholder="Phone Number*"
                                    defaultValue=""
                                    type="tel"
                                    name="your-phone"
                                   />
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                              <span className="wpcf7-form-control-wrap your-dimensions">
                                <span className="wpcf7-form-control-wrap" data-name="your-dimensions">
                                  <input
                                    size="40"
                                    maxLength="400"
                                    className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel"
                                    aria-required="true"
                                    aria-invalid="false"
                                    placeholder="Dimensions (L × W × H)"
                                    defaultValue=""
                                    type="tel"
                                    name="your-dimensions"
                                   />
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-xs-12 mt15-ctf">
                              <label>Freight Type</label>
                              {" "}
                              <span className="wpcf7-form-control-wrap your-frieght">
                                <span className="wpcf7-form-control-wrap" data-name="your-frieght">
                                  <select className="wpcf7-form-control wpcf7-select" aria-invalid="false" name="your-frieght">
                                    <option value="Truck Freight">Truck Freight</option>
                                    <option value="Ship Freight">Ship Freight</option>
                                    <option value="Train Freight">Train Freight</option>
                                    <option value="Plane Freight">Plane Freight</option>
                                  </select>
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-xs-12 mt15-ctf">
                              <label>Incoterms</label>
                              {" "}
                              <span className="wpcf7-form-control-wrap your-incoterms">
                                <span className="wpcf7-form-control-wrap" data-name="your-incoterms">
                                  <select className="wpcf7-form-control wpcf7-select" aria-invalid="false" name="your-incoterms">
                                    <option value="EXW">EXW</option>
                                    <option value="CFR">CFR</option>
                                    <option value="DAP">DAP</option>
                                  </select>
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                              <span className="wpcf7-form-control-wrap your-origin-location">
                                <span className="wpcf7-form-control-wrap" data-name="your-origin-location">
                                  <input
                                    size="40"
                                    maxLength="400"
                                    className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                    aria-required="true"
                                    aria-invalid="false"
                                    placeholder="Origin Location"
                                    defaultValue=""
                                    type="text"
                                    name="your-origin-location"
                                   />
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                              <span className="wpcf7-form-control-wrap your-destination-location">
                                <span className="wpcf7-form-control-wrap" data-name="your-destination-location">
                                  <input
                                    size="40"
                                    maxLength="400"
                                    className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                    aria-required="true"
                                    aria-invalid="false"
                                    placeholder="Destination Location"
                                    defaultValue=""
                                    type="text"
                                    name="your-destination-location"
                                   />
                                </span>
                              </span>
                            </div>
                            <div className="input-filled col-xl-12">
                              <span className="wpcf7-form-control-wrap your-radio">
                                <span className="wpcf7-form-control-wrap" data-name="radio-605">
                                  <span className="wpcf7-form-control wpcf7-radio">
                                    <span className="wpcf7-list-item first">
                                      <label>
                                        <input type="radio" name="radio-605" defaultValue="Fragile" defaultChecked={true} />
                                        <span className="wpcf7-list-item-label">Fragile</span>
                                      </label>
                                    </span>
                                    <span className="wpcf7-list-item">
                                      <label>
                                        <input type="radio" name="radio-605" defaultValue="Express" />
                                        <span className="wpcf7-list-item-label">Express</span>
                                      </label>
                                    </span>
                                    <span className="wpcf7-list-item">
                                      <label>
                                        <input type="radio" name="radio-605" defaultValue="Insurance" />
                                        <span className="wpcf7-list-item-label">Insurance</span>
                                      </label>
                                    </span>
                                    <span className="wpcf7-list-item last">
                                      <label>
                                        <input type="radio" name="radio-605" defaultValue="Packaging" />
                                        <span className="wpcf7-list-item-label">Packaging</span>
                                      </label>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </div>
                            <div className="input-filled wrap-button col-xl-12">
                              <button type="submit" className=" btn  btn-default  two-icon  pxl-icon--left">
                                <div className="before-button" bis_skin_checked="1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21" fill="none">
                                    <path
                                      d="M30 15C30 18.3137 27.3137 21 24 21H19.4852C17.8939 21 16.3679 20.3679 15.2427 19.2428L0.828676 4.8296C0.298084 4.29904 0 3.57943 0 2.82908C0 1.26662 1.26662 0 2.82908 0H24C27.3137 0 30 2.68629 30 6V15Z"
                                      fill="#FE000B"
                                    ></path>
                                  </svg>
                                </div>
                                <div className="after-button" bis_skin_checked="1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21" fill="none">
                                    <path
                                      d="M30 15C30 18.3137 27.3137 21 24 21H19.4852C17.8939 21 16.3679 20.3679 15.2427 19.2428L0.828676 4.8296C0.298084 4.29904 0 3.57943 0 2.82908C0 1.26662 1.26662 0 2.82908 0H24C27.3137 0 30 2.68629 30 6V15Z"
                                      fill="#FE000B"
                                    ></path>
                                  </svg>
                                </div>
                                <span className="wrap-icon-1 wrap-icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
                                    <path
                                      d="M9.97801 4.69883L6.32176 8.35508C6.20728 8.46956 6.05201 8.53387 5.89012 8.53387C5.72822 8.53387 5.57296 8.46956 5.45848 8.35508C5.344 8.2406 5.27969 8.08534 5.27969 7.92344C5.27969 7.76154 5.344 7.60628 5.45848 7.4918L8.07422 4.87707H0.609375C0.447759 4.87707 0.292762 4.81287 0.178482 4.69859C0.0642018 4.58431 0 4.42931 0 4.2677C0 4.10608 0.0642018 3.95108 0.178482 3.8368C0.292762 3.72252 0.447759 3.65832 0.609375 3.65832H8.07422L5.45949 1.04207C5.34501 0.927595 5.2807 0.772329 5.2807 0.610432C5.2807 0.448535 5.34501 0.29327 5.45949 0.178791C5.57397 0.0643131 5.72924 1.70586e-09 5.89113 0C6.05303 -1.70586e-09 6.20829 0.0643131 6.32277 0.178791L9.97902 3.83504C10.0358 3.89173 10.0809 3.95909 10.1116 4.03324C10.1423 4.10739 10.1581 4.18688 10.158 4.26715C10.1579 4.34741 10.142 4.42686 10.1111 4.50095C10.0802 4.57503 10.035 4.64228 9.97801 4.69883Z"
                                      fill="white"
                                    ></path>
                                  </svg>
                                </span>
                                {" "}
                                <span className="pxl--btn-text">{" Request a quote "}</span>
                                {" "}
                                <span className="wrap-icon-2 wrap-icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
                                    <path
                                      d="M9.97801 4.69883L6.32176 8.35508C6.20728 8.46956 6.05201 8.53387 5.89012 8.53387C5.72822 8.53387 5.57296 8.46956 5.45848 8.35508C5.344 8.2406 5.27969 8.08534 5.27969 7.92344C5.27969 7.76154 5.344 7.60628 5.45848 7.4918L8.07422 4.87707H0.609375C0.447759 4.87707 0.292762 4.81287 0.178482 4.69859C0.0642018 4.58431 0 4.42931 0 4.2677C0 4.10608 0.0642018 3.95108 0.178482 3.8368C0.292762 3.72252 0.447759 3.65832 0.609375 3.65832H8.07422L5.45949 1.04207C5.34501 0.927595 5.2807 0.772329 5.2807 0.610432C5.2807 0.448535 5.34501 0.29327 5.45949 0.178791C5.57397 0.0643131 5.72924 1.70586e-09 5.89113 0C6.05303 -1.70586e-09 6.20829 0.0643131 6.32277 0.178791L9.97902 3.83504C10.0358 3.89173 10.0809 3.95909 10.1116 4.03324C10.1423 4.10739 10.1581 4.18688 10.158 4.26715C10.1579 4.34741 10.142 4.42686 10.1111 4.50095C10.0802 4.57503 10.035 4.64228 9.97801 4.69883Z"
                                      fill="white"
                                    ></path>
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="wpcf7-response-output" aria-hidden="true"></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-8ab9a6a elementor-absolute animated-slow elementor-hidden-tablet elementor-hidden-mobile pxl-none overflow-visible elementor-invisible elementor-widget elementor-widget-pxl_image"
              data-id="8ab9a6a"
              data-element_type="widget"
              data-e-type="widget"
              data-settings={"{\"_position\":\"absolute\",\"_animation\":\"slideInDown\"}"}
              data-widget_type="pxl_image.default"
            >
              <div className="elementor-widget-container">
                <div
                  id="pxl_image-8ab9a6a-5080"
                  className="pxl-image-single  pxl-disable-parallax-sm pxl-hide-sr-lg  "
                  data-wow-delay="ms"
                >
                  <div className="pxl-item--inner" data-wow-delay="120ms">
                    <div className="pxl-item--image " data-parallax-value="">
                      <img loading="lazy" decoding="async" src="/uploads/2026/02/ard.png" className="no-lazyload attachment-full" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-818a94e e-con-full e-flex pxl-row-scroll-none pxl-column-none pxl-full-content-with-space-none pxl-container-line-none pxl-container-video-background-none pxl-none overflow-visible e-con e-child "
            data-id="818a94e"
            data-element_type="container"
            data-e-type="container"
          >
            <div
              className="elementor-element elementor-element-bbc4ce6 elementor-widget__width-inherit pxl-none overflow-visible elementor-widget elementor-widget-pxl_heading"
              data-id="bbc4ce6"
              data-element_type="widget"
              data-e-type="widget"
              data-widget_type="pxl_heading.default"
            >
              <div className="elementor-widget-container">
                <div id="pxl-pxl_heading-bbc4ce6-5005" className="pxl-heading   px-sub-title-default-style ">
                  <div className="pxl-heading--inner">
                    <h3 className="pxl-item--title style-default color highlight-default " data-wow-delay="ms">{" Fast, Reliable, and Secure. "}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-a29efb3 elementor-widget__width-inherit pxl-none overflow-visible elementor-widget elementor-widget-pxl_text_editor"
              data-id="a29efb3"
              data-element_type="widget"
              data-e-type="widget"
              data-widget_type="pxl_text_editor.default"
            >
              <div className="elementor-widget-container">
                <div className="pxl-text-editor default ">
                  <div className="pxl-item--inner  " data-wow-delay="ms">
                    <p>
                      Submit your request to receive a tailored quote based on your routes, volume, and delivery requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-1f88127 elementor-widget__width-initial pxl-none overflow-visible elementor-widget elementor-widget-pxl_icon"
              data-id="1f88127"
              data-element_type="widget"
              data-e-type="widget"
              data-widget_type="pxl_icon.default"
            >
              <div className="elementor-widget-container">
                <div className="pxl-icon-list pxl-icon1  style-4   " data-wow-delay="ms">
                  <a className="elementor-repeater-item-21bca91 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                      <path
                        d="M19.4062 19.4068H10.9688V11.7519C12.4467 11.5386 13.7889 10.7734 14.7254 9.61035C15.6618 8.44728 16.123 6.97267 16.0161 5.48329C15.9092 3.99391 15.2421 2.6003 14.149 1.58295C13.056 0.565591 11.6182 0 10.125 0C8.63178 0 7.19398 0.565591 6.10097 1.58295C5.00795 2.6003 4.34085 3.99391 4.23391 5.48329C4.12698 6.97267 4.58816 8.44728 5.52463 9.61035C6.4611 10.7734 7.80335 11.5386 9.28125 11.7519V19.4068H0.84375C0.619974 19.4068 0.405363 19.4957 0.247129 19.654C0.088895 19.8122 0 20.0268 0 20.2506C0 20.4744 0.088895 20.689 0.247129 20.8472C0.405363 21.0055 0.619974 21.0943 0.84375 21.0943H19.4062C19.63 21.0943 19.8446 21.0055 20.0029 20.8472C20.1611 20.689 20.25 20.4744 20.25 20.2506C20.25 20.0268 20.1611 19.8122 20.0029 19.654C19.8446 19.4957 19.63 19.4068 19.4062 19.4068ZM5.90625 5.90684C5.90625 5.07245 6.15368 4.2568 6.61724 3.56303C7.0808 2.86926 7.73968 2.32853 8.51055 2.00923C9.28143 1.68992 10.1297 1.60637 10.948 1.76916C11.7664 1.93194 12.5181 2.33373 13.1081 2.92374C13.6981 3.51374 14.0999 4.26545 14.2627 5.08381C14.4255 5.90216 14.3419 6.75041 14.0226 7.52129C13.7033 8.29216 13.1626 8.95104 12.4688 9.41461C11.775 9.87817 10.9594 10.1256 10.125 10.1256C9.00612 10.1256 7.93306 9.68112 7.14189 8.88995C6.35072 8.09878 5.90625 7.02573 5.90625 5.90684Z"
                        fill="white"
                      ></path>
                    </svg>
                  </a>
                  {" "}
                  <span className="pxl-icon-label">1234 Elmwood Avenue, Suite 500 Atlanta, GA 30308, United States</span>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-c319d26 elementor-widget__width-initial pxl-none overflow-visible elementor-widget elementor-widget-pxl_icon"
              data-id="c319d26"
              data-element_type="widget"
              data-e-type="widget"
              data-widget_type="pxl_icon.default"
            >
              <div className="elementor-widget-container">
                <div className="pxl-icon-list pxl-icon1  style-4   " data-wow-delay="ms">
                  <a className="elementor-repeater-item-21bca91 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                      <path
                        d="M20.5667 0.438994C20.378 0.250495 20.1425 0.115687 19.8844 0.0484554C19.6263 -0.0187758 19.3549 -0.0159994 19.0982 0.0564985H19.0841L1.0849 5.51643C0.792695 5.60062 0.532974 5.77159 0.340158 6.00668C0.147342 6.24177 0.0305331 6.52989 0.00521152 6.83285C-0.02011 7.13581 0.0472507 7.43931 0.198367 7.70313C0.349484 7.96695 0.577222 8.17864 0.851402 8.31014L8.8148 12.1876L12.6877 20.1441C12.8082 20.401 12.9997 20.6182 13.2396 20.7699C13.4796 20.9215 13.7579 21.0014 14.0418 21C14.085 21 14.1281 20.9981 14.1712 20.9944C14.474 20.9698 14.7621 20.8533 14.9968 20.6605C15.2314 20.4676 15.4015 20.2076 15.4841 19.9153L20.9418 1.92116C20.9418 1.91648 20.9418 1.91179 20.9418 1.9071C21.0153 1.65113 21.0192 1.38023 20.9533 1.12222C20.8874 0.864204 20.754 0.628388 20.5667 0.438994ZM14.0503 19.4859L14.0456 19.4991V19.4925L10.2889 11.777L14.7902 7.27703C14.9249 7.13524 14.9989 6.94643 14.9964 6.75086C14.9939 6.55529 14.9151 6.36844 14.7768 6.23014C14.6384 6.09184 14.4515 6.01303 14.2559 6.01053C14.0603 6.00803 13.8714 6.08202 13.7296 6.21673L9.22835 10.7167L1.50783 6.9611H1.50127H1.51439L19.5052 1.50023L14.0503 19.4859Z"
                        fill="white"
                      ></path>
                    </svg>
                  </a>
                  {" "}
                  <span className="pxl-icon-label">+1 (904) 567-6548 support@worldbridgexpress.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
