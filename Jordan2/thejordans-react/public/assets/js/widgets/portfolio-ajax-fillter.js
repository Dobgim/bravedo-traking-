jQuery(function ($) {
  var selectedFilters = {};
  var $gridScope = null;
  var $gridIsotope = null;
  var isoOptions = {};

  function getGridSizerColumns($gridInner) {
    if (!$gridInner || !$gridInner.hasClass("pxl-grid-masonry")) {
      return null;
    }

    var $gridSizer = $gridInner.find(".grid-sizer");

    if ($gridSizer.length === 0) {
      return null;
    }

    var gridSizerClasses = $gridSizer.attr("class");

    if (!gridSizerClasses) {
      return null;
    }

    var columnClasses = [];
    var classArray = gridSizerClasses.split(" ");

    classArray.forEach(function (className) {
      if (className.match(/^col-(xl|lg|md|sm|xs)?-\d+$/)) {
        columnClasses.push(className);
      }
    });

    return columnClasses.length > 0 ? columnClasses : null;
  }

  function extractColumnClassesFromItem($item) {
    if (!$item || !$item.length) {
      return null;
    }

    var itemClasses = $item.attr("class") || "";
    var columnClasses = [];
    var classArray = itemClasses.split(" ");

    classArray.forEach(function (className) {
      if (className.match(/^col-(xl|lg|md|sm|xs)?-\d+$/)) {
        columnClasses.push(className);
      }
    });

    return columnClasses.length > 0 ? columnClasses : null;
  }

  function saveColumnClassesPattern($gridInner) {
    if (!$gridInner || !$gridInner.hasClass("pxl-grid-masonry")) {
      return;
    }

    if ($gridInner.data("column-classes-pattern")) {
      return;
    }

    var pattern = [];
    var $items = $gridInner.find(".pxl-grid-item");

    $items.each(function () {
      var $item = $(this);
      var columnClasses = extractColumnClassesFromItem($item);

      if (columnClasses && columnClasses.length > 0) {
        pattern.push(columnClasses);
      }
    });

    if (pattern.length > 0) {
      $gridInner.data("column-classes-pattern", pattern);
    }
  }

  function applyGridSizerColumnsToItems($gridInner) {
    if (!$gridInner || !$gridInner.hasClass("pxl-grid-masonry")) {
      return;
    }

    var $items = $gridInner.find(".pxl-grid-item");
    if ($items.length === 0) {
      return;
    }

    var pattern = $gridInner.data("column-classes-pattern");

    if (pattern && pattern.length > 0) {
      $items.each(function (index) {
        var $item = $(this);
        var itemClasses = $item.attr("class") || "";

        itemClasses = itemClasses
          .replace(/\bcol-(xl|lg|md|sm|xs)?-\d+\b/g, "") // Remove complete classes like col-xl-6
          .replace(/\bcol-(xl|lg|md|sm|xs)?-\s*/g, "") // Remove incomplete classes like col-xl-
          .replace(/\s+/g, " ")
          .trim();

        var patternIndex = index % pattern.length;
        var columnClasses = pattern[patternIndex];
        var columnClassesStr = columnClasses.join(" ");

        var newClasses = itemClasses + " " + columnClassesStr;
        $item.attr("class", newClasses.trim());
      });

      return;
    }

    var columnClasses = $gridInner.data("grid-sizer-classes");
    if (!columnClasses) {
      columnClasses = getGridSizerColumns($gridInner);
      if (columnClasses) {
        $gridInner.data("grid-sizer-columns", columnClasses.join(" "));
        $gridInner.data("grid-sizer-classes", columnClasses);
      }
    }

    if (!columnClasses || columnClasses.length === 0) {
      return;
    }

    var columnClassesStr = columnClasses.join(" ");

    $items.each(function () {
      var $item = $(this);
      var itemClasses = $item.attr("class") || "";

      itemClasses = itemClasses
        .replace(/\bcol-(xl|lg|md|sm|xs)?-\d+\b/g, "")
        .replace(/\bcol-(xl|lg|md|sm|xs)?-\s*/g, "")
        .replace(/\s+/g, " ")
        .trim();

      var newClasses = itemClasses + " " + columnClassesStr;
      $item.attr("class", newClasses.trim());
    });
  }

  function initGrid() {
    $gridScope = $(".pxl-portfolio-grid12312312321");///offf

    if ($gridScope.length === 0) {
      return;
    }

    // Lấy trực tiếp từ attribute để đảm bảo có đầy đủ data
    var loadmoreAttr = $gridScope.attr("data-loadmore");

    var loadmore = null;

    // Nếu có attribute, parse JSON
    if (loadmoreAttr && loadmoreAttr.trim() !== "") {
      try {
        loadmore = JSON.parse(loadmoreAttr);
      } catch (e) {
        // Fallback: thử dùng .data()
        loadmore = $gridScope.data("loadmore");
      }
    } else {
      // Nếu không có attribute, thử dùng .data()
      loadmore = $gridScope.data("loadmore");
    }

    // Nếu loadmore vẫn là string, parse lại
    if (typeof loadmore === "string") {
      try {
        loadmore = JSON.parse(loadmore);
      } catch (e) {
        loadmore = null;
      }
    }

    if (!loadmore || Object.keys(loadmore).length === 0) {
      loadmore = window.carryon_grid_settings || {};
    }

    // Lấy isotope nếu có
    var $gridMasonry = $gridScope.find(".pxl-grid-masonry");
    if ($gridMasonry.length > 0) {
      isoOptions = {
        itemSelector: ".pxl-grid-item",
        layoutMode: $gridScope.attr("data-layout") || "masonry",
        fitRows: { gutter: 0 },
        percentPosition: true,
        masonry: { columnWidth: ".grid-sizer" },
        containerStyle: null,
        stagger: 30,
        sortBy: "name"
      };
      $gridIsotope = $gridMasonry.isotope(isoOptions);
    }

    return loadmore;
  }

  // =======================
  // =======================
  function getFiltersFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var filters = {};

    urlParams.forEach(function (value, key) {
      if (
        (key.indexOf("_") > -1 || key.indexOf("-") > -1) &&
        key !== "paged" &&
        key !== "s" &&
        key !== "post_type"
      ) {
        var taxonomy = key;
        var terms = value.split(",").filter(Boolean);
        if (terms.length > 0) {
          filters[taxonomy] = terms;
        }
      }
    });

    return filters;
  }

  // =======================
  // =======================
  function updateURL(filters) {
    var url = new URL(window.location.href);

    var keysToDelete = [];
    url.searchParams.forEach(function (value, key) {
      if (
        (key.indexOf("_") > -1 || key.indexOf("-") > -1) &&
        key !== "paged" &&
        key !== "s" &&
        key !== "post_type"
      ) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(function (key) {
      url.searchParams.delete(key);
    });

    $.each(filters, function (taxonomy, terms) {
      if (terms && terms.length > 0) {
        url.searchParams.set(taxonomy, terms.join(","));
      }
    });

    if (window.history && window.history.pushState) {
      window.history.pushState({ filters: filters }, "", url.toString());
    }
  }

  // =======================
  // =======================
  function updateFilterUI(filters) {
    $(".pxl-portfolio-filter ul a").removeClass("is-active");

    $.each(filters, function (taxonomy, terms) {
      if (terms && terms.length > 0) {
        var termSlug = terms[0];
        $(
          '.pxl-portfolio-filter ul a[data-taxonomy="' +
          taxonomy +
          '"][data-term-slug="' +
          termSlug +
          '"]'
        ).addClass("is-active");

        var text = $(
          '.pxl-portfolio-filter ul a[data-taxonomy="' +
          taxonomy +
          '"][data-term-slug="' +
          termSlug +
          '"]'
        ).text();

        $(
          '.pxl-portfolio-filter ul a[data-taxonomy="' +
          taxonomy +
          '"][data-term-slug="' +
          termSlug +
          '"]'
        )
          .closest('ul[data-taxonomy="' + taxonomy + '"]')
          .find("li a.pxl-filter-placeholder")
          .text(text);
      }
    });
  }

  // =======================
  // =======================
  function sendFilterRequest(filters, paged) {
    var loadmore = initGrid();
    if (!loadmore) {
      return;
    }

    if (typeof loadmore === "string") {
      try {
        loadmore = JSON.parse(loadmore);
      } catch (e) {
        return;
      }
    }

    var pageNumber = paged;
    if (typeof pageNumber === "undefined" || pageNumber === null) {
      var urlParams = new URLSearchParams(window.location.search);
      pageNumber = urlParams.get("paged");
      if (pageNumber) {
        pageNumber = parseInt(pageNumber);
      } else {
        pageNumber = 1;
      }
    }

    var loadmoreCopy = JSON.parse(JSON.stringify(loadmore));
    loadmoreCopy.paged = pageNumber;

    var settingsJsonString = JSON.stringify(loadmoreCopy);

    var filtersToSend = filters || {};
    if (typeof filtersToSend !== "object" || Array.isArray(filtersToSend)) {
      filtersToSend = {};
    }

    var filtersJsonString = JSON.stringify(filtersToSend);

    var handlerClick = pageNumber !== 1 ? "pagination" : "filter";

    var ajaxData = {
      action: "carryon_load_more_post_grid",
      handler_click: handlerClick,
      settings_json: settingsJsonString,
      filters_json: filtersJsonString
    };

    $.ajax({
      url:
        typeof main_params !== "undefined" && main_params.ajax_url ? main_params.ajax_url : ajaxurl,
      type: "POST",
      data: ajaxData,
      traditional: true,
      beforeSend: function () {
        $gridScope.addClass("is-loading");
        if ($gridScope.find(".pxl-grid-overlay-loading").length > 0) {
          $gridScope.find(".pxl-grid-overlay-loading").removeClass("loaded").addClass("loader");
        }
      },
      success: function (res) {
        if (res.status && res.data) {
          var $gridInner = $gridScope.find(".pxl-grid-inner");
          if ($gridInner.length === 0) {
            $gridInner = $gridScope.find(".pxl-grid-masonry");
          }
          if ($gridInner.length === 0) {
            $gridInner = $gridScope.find(".row");
          }

          if ($gridInner.length > 0) {
            $gridInner.find(".pxl-grid-item").remove();

            $gridInner.append(res.data.html);

            applyGridSizerColumnsToItems($gridInner);
          }

          if ($gridIsotope && isoOptions) {
            $gridIsotope.isotope("destroy");
            var $gridMasonry = $gridScope.find(".pxl-grid-masonry");
            if ($gridMasonry.length > 0) {
              $gridIsotope = $gridMasonry.isotope(isoOptions);
            }
          }

          if (res.data.pagin_html) {
            $gridScope.find(".pxl-grid-pagination").html(res.data.pagin_html);

            if (res.data.max && res.data.max <= 1) {
              $gridScope.find(".pxl-grid-pagination").hide();
            } else {
              $gridScope.find(".pxl-grid-pagination").show();
            }
          } else {
            $gridScope.find(".pxl-grid-pagination").hide();
          }

          if (loadmore.pagination_type === "loadmore") {
            if (res.data.paged >= res.data.max) {
              $gridScope.find(".pxl-load-more").hide();
            } else {
              $gridScope.find(".pxl-load-more").show();
            }
          }

          if (res.data.paged) {
            $gridScope.data("start-page", res.data.paged);
          }
        }
      },
      error: function (xhr, status, error) { },
      complete: function () {
        $gridScope.removeClass("is-loading");
        if ($gridScope.find(".pxl-grid-overlay-loading").length > 0) {
          $gridScope.find(".pxl-grid-overlay-loading").removeClass("loader").addClass("loaded");
        }
      }
    });
  }
  // =======================
  $(".pxl-portfolio-filter").on("click", "ul a", function (e) {
    e.preventDefault();

    var $this = $(this);
    var taxonomy = $this.data("taxonomy");
    var termSlug = $this.data("term-slug");
    var text = $this.text();
    var originalText = $(this)
      .closest('ul[data-taxonomy="' + taxonomy + '"]')
      .find("a.pxl-filter-placeholder")
      .data("original-text");

    if (!taxonomy || !termSlug) return;

    var isCurrentlySelected =
      selectedFilters[taxonomy] && selectedFilters[taxonomy].indexOf(termSlug) !== -1;

    if (isCurrentlySelected) {
      delete selectedFilters[taxonomy];
      $this.removeClass("is-active");
    } else {
      if (selectedFilters[taxonomy]) {
        $('.pxl-portfolio-filter ul[data-taxonomy="' + taxonomy + '"] a').removeClass("is-active");
      }

      selectedFilters[taxonomy] = [termSlug];
      $this.addClass("is-active");
    }

    if ($(this).closest("ul").find("li a.is-active").length == 0) {
      $(this)
        .closest('ul[data-taxonomy="' + taxonomy + '"]')
        .find("a.pxl-filter-placeholder")
        .text(originalText);
    } else {
      $(this)
        .closest('ul[data-taxonomy="' + taxonomy + '"]')
        .find("a.pxl-filter-placeholder")
        .text(text);
    }
    updateURL(selectedFilters);
  });

  $(document).on("click", ".pxl-portfolio-filter > a.btn", function (e) {
    e.preventDefault();

    var filters = {};
    $(".pxl-portfolio-filter a.is-active").each(function () {
      var $this = $(this);
      var taxonomy = $this.data("taxonomy");
      var termSlug = $this.data("term-slug");

      if (taxonomy && termSlug) {
        if (!filters[taxonomy]) {
          filters[taxonomy] = [];
        }
        if (filters[taxonomy].indexOf(termSlug) === -1) {
          filters[taxonomy].push(termSlug);
        }
      }
    });

    if (Object.keys(filters).length === 0) {
      if (Object.keys(selectedFilters).length > 0) {
        filters = JSON.parse(JSON.stringify(selectedFilters));
      }
    }

    selectedFilters = filters;

    var url = new URL(window.location.href);

    var keysToDelete = [];
    url.searchParams.forEach(function (value, key) {
      if (
        (key.indexOf("_") > -1 || key.indexOf("-") > -1) &&
        key !== "paged" &&
        key !== "s" &&
        key !== "post_type"
      ) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(function (key) {
      url.searchParams.delete(key);
    });

    $.each(filters, function (taxonomy, terms) {
      if (terms && terms.length > 0) {
        url.searchParams.set(taxonomy, terms.join(","));
      }
    });

    url.searchParams.set("paged", "1");

    if (window.history && window.history.pushState) {
      window.history.pushState({ filters: filters, paged: 1 }, "", url.toString());
    }

    sendFilterRequest(filters, 1);
  });

  $(document).on(
    "click",
    ".pxl-grid-pagination a.page-numbers, .pxl-grid-pagination .prev, .pxl-grid-pagination .next",
    function (e) {
      e.preventDefault();

      var $this = $(this);
      var href = $this.attr("href");
      var pageNumber = 1;

      var currentPage = 1;
      var urlParams = new URLSearchParams(window.location.search);
      var currentPageParam = urlParams.get("paged");
      if (currentPageParam) {
        currentPage = parseInt(currentPageParam);
      } else if ($gridScope && $gridScope.data("start-page")) {
        currentPage = parseInt($gridScope.data("start-page"));
      }

      if (href && href !== "#" && href !== "") {
        try {
          var urlObj;
          if (href.indexOf("http://") === 0 || href.indexOf("https://") === 0) {
            urlObj = new URL(href);
          } else {
            urlObj = new URL(href, window.location.origin + window.location.pathname);
          }

          var pagedParam = urlObj.searchParams.get("paged");
          if (pagedParam) {
            pageNumber = parseInt(pagedParam);
          } else {
            if ($this.hasClass("prev") || $this.closest(".prev").length > 0) {
              pageNumber = Math.max(1, currentPage - 1);
            } else if ($this.hasClass("next") || $this.closest(".next").length > 0) {
              pageNumber = currentPage + 1;
            } else {
              var text = $this.text().trim();
              if (text && !isNaN(text)) {
                pageNumber = parseInt(text);
              }
            }
          }
        } catch (e) {
          if ($this.hasClass("prev") || $this.closest(".prev").length > 0) {
            pageNumber = Math.max(1, currentPage - 1);
          } else if ($this.hasClass("next") || $this.closest(".next").length > 0) {
            pageNumber = currentPage + 1;
          } else {
            var text = $this.text().trim();
            if (text && !isNaN(text)) {
              pageNumber = parseInt(text);
            }
          }
        }
      } else {
        if ($this.hasClass("prev") || $this.closest(".prev").length > 0) {
          pageNumber = Math.max(1, currentPage - 1);
        } else if ($this.hasClass("next") || $this.closest(".next").length > 0) {
          pageNumber = currentPage + 1;
        } else {
          var text = $this.text().trim();
          if (text && !isNaN(text)) {
            pageNumber = parseInt(text);
          }
        }
      }

      var url = new URL(window.location.href);
      url.searchParams.set("paged", pageNumber);

      $.each(selectedFilters, function (taxonomy, terms) {
        if (terms && terms.length > 0) {
          url.searchParams.set(taxonomy, terms.join(","));
        }
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(
          { filters: selectedFilters, paged: pageNumber },
          "",
          url.toString()
        );
      }

      sendFilterRequest(selectedFilters, pageNumber);
    }
  );

  // =======================
  // =======================
  $(window).on("popstate", function (e) {
    if (e.originalEvent.state && e.originalEvent.state.filters) {
      selectedFilters = e.originalEvent.state.filters;
      updateFilterUI(selectedFilters);
      sendFilterRequest(selectedFilters);
    } else {
      selectedFilters = {};
      updateFilterUI({});
      sendFilterRequest({});
    }
  });

  $(document).ready(function () {
    $(".pxl-grid-inner.pxl-grid-masonry").each(function () {
      var $gridInner = $(this);

      saveColumnClassesPattern($gridInner);

      var columnClasses = getGridSizerColumns($gridInner);
      if (columnClasses) {
        $gridInner.data("grid-sizer-columns", columnClasses.join(" "));
        $gridInner.data("grid-sizer-classes", columnClasses);
      }

      applyGridSizerColumnsToItems($gridInner);
    });

    if (typeof MutationObserver !== "undefined") {
      var gridObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function (node) {
              if (node.nodeType === 1) {
                var $node = $(node);
                if ($node.hasClass("pxl-grid-item") || $node.find(".pxl-grid-item").length > 0) {
                  var $gridInner = $node.closest(".pxl-grid-inner.pxl-grid-masonry");
                  if ($gridInner.length > 0) {
                    setTimeout(function () {
                      applyGridSizerColumnsToItems($gridInner);
                    }, 100);
                  }
                }
              }
            });
          }
        });
      });

      $(".pxl-grid-inner.pxl-grid-masonry").each(function () {
        gridObserver.observe(this, {
          childList: true,
          subtree: true
        });
      });
    }

    window.applyGridSizerColumnsToItems = applyGridSizerColumnsToItems;

    setTimeout(function () {
      selectedFilters = getFiltersFromURL();
      if (Object.keys(selectedFilters).length > 0) {
        updateFilterUI(selectedFilters);
        setTimeout(function () {
          sendFilterRequest(selectedFilters);
        }, 500);
      }
    }, 100);

    function updatePortfolioFilterDisplay() {
      $(".pxl-portfolio-filter > ul").each(function () {
        var $ul = $(this);
        var $firstItem = $ul.find("> li:first-child > a");
        var $activeItem = $ul.find("> li > ul.pxl-filter-dropdown > li > a.is-active");

        var originalLabel =
          $ul.data("original-label") || $firstItem.data("original-text") || $firstItem.text();
        if (!$ul.data("original-label")) {
          $ul.data("original-label", originalLabel);
        }
        if (!$firstItem.data("original-text")) {
          $firstItem.data("original-text", originalLabel);
        }

        if ($activeItem.length) {
          $firstItem.text($activeItem.text()).removeClass("pxl-filter-placeholder");
        } else {
          $firstItem.text(originalLabel).addClass("pxl-filter-placeholder");
        }
      });
    }

    function initPortfolioFilter() {
      if ($(".pxl-portfolio-filter").length === 0) {
        return;
      }

      $(".pxl-portfolio-filter > ul").each(function () {
        var $ul = $(this);
        var $firstItem = $ul.find("> li:first-child > a");
        var $dropdownList = $ul.find("> li:first-child > ul.pxl-filter-dropdown");
        var $dropdownItems = $dropdownList.find("> li > a");

        if ($firstItem.length === 0) return;

        $firstItem.off("click.portfolioFilter").on("click.portfolioFilter", function (e) {
          e.preventDefault();
          e.stopPropagation();

          $(".pxl-portfolio-filter > ul").not($ul).removeClass("active");

          $ul.toggleClass("active");
        });

        $dropdownItems.off("click.portfolioFilterUI").on("click.portfolioFilterUI", function (e) {
          var $clickedItem = $(this);
          var itemText = $clickedItem.text();
          var originalLabel =
            $ul.data("original-label") || $firstItem.data("original-text") || $firstItem.text();

          var isCurrentlyActive = $clickedItem.hasClass("is-active");

          if (!isCurrentlyActive) {
            $firstItem.text(itemText).removeClass("pxl-filter-placeholder");
          }

          setTimeout(function () {
            $ul.removeClass("active");
            updatePortfolioFilterDisplay();
          }, 200);
        });
      });
    }

    initPortfolioFilter();
    updatePortfolioFilterDisplay();

    setTimeout(function () {
      updatePortfolioFilterDisplay();
      initPortfolioFilter();
    }, 500);

    $(window).on("load", function () {
      setTimeout(function () {
        initPortfolioFilter();
        updatePortfolioFilterDisplay();
      }, 100);
    });

    if (typeof MutationObserver !== "undefined") {
      var filterObserver = new MutationObserver(function (mutations) {
        var shouldUpdate = false;
        mutations.forEach(function (mutation) {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            var target = mutation.target;
            if (
              $(target).hasClass("is-active") ||
              ($(target).is("a") && $(target).closest(".pxl-portfolio-filter").length)
            ) {
              shouldUpdate = true;
            }
          }
          if (mutation.type === "childList") {
            shouldUpdate = true;
          }
        });
        if (shouldUpdate) {
          setTimeout(function () {
            updatePortfolioFilterDisplay();
          }, 150);
        }
      });

      $(".pxl-portfolio-filter").each(function () {
        filterObserver.observe(this, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"]
        });
      });
    }

    $(document).on("ajaxComplete", function () {
      setTimeout(updatePortfolioFilterDisplay, 100);
    });

    $(document).on("click.portfolioFilter", function (e) {
      if (!$(e.target).closest(".pxl-portfolio-filter > ul").length) {
        $(".pxl-portfolio-filter > ul").removeClass("active");
      }
    });
  });
});
