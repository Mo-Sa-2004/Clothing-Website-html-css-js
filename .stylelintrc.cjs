// stylelint-config-standard catches real problems (duplicate selectors,
// invalid values, empty rules, etc.) as well as it should -- none of those
// fired on this codebase. The rules turned off below are pure style/
// "modernize the syntax" preferences rather than correctness issues, and
// in one case (media-feature-range-notation) the "modern" syntax it wants
// has materially weaker browser support than what's already here, so
// applying it would be a regression, not an improvement:
module.exports = {
    extends: "stylelint-config-standard",
    rules: {
        // rgba(0,0,0,0.1) vs rgb(0 0 0 / 10%) -- both are valid CSS;
        // the existing rgba() notation is more widely recognized and
        // isn't worth a mechanical rewrite of ~20 call sites for no
        // functional difference.
        "color-function-notation": null,
        "alpha-value-notation": null,

        // "Inter" as a quoted font-family name is intentional and common
        // practice for multi-word font names.
        "font-family-name-quotes": null,

        // #ffffff/#000000 vs the shorthand #fff/#000 render identically;
        // not worth the churn.
        "color-hex-length": null,

        // Blank-line-before-rule/comment is a pure formatting preference
        // this project doesn't follow; reformatting every rule in the
        // file for spacing alone isn't worth the diff noise.
        "rule-empty-line-before": null,
        "comment-empty-line-before": null,

        // (max-width: 768px) vs (width <= 768px): the range syntax this
        // rule wants isn't supported in Safari < 16.4, which would make
        // the mobile media query silently fail to match for real users on
        // older iOS/Safari. The existing syntax is the correct choice
        // here, not a lint violation.
        "media-feature-range-notation": null,
    },
};
