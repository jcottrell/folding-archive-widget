(function (win, doc, undefined) {
	'use strict';
	win.FAWJC = {
		addClick	:	function (el, fun) {
							if (el.addEventListener) {
								el.addEventListener('click', fun, false);
							} else if (el.attachEvent) {
								el.attachEvent('onclick', fun);
							}
		},
		showLis	:	function () {
							/* the first child [0] will be a span, used to hold the arrows, so we start with 1 */
							var lis = this.children,
								lisi = 1, lisLen = lis.length,
								lisDis = (lis[1]) ? (lis[1].style.display === 'block' ? 'none' : 'block') : '',
								selStripped = this.children[0].className.replace(/ selected/gi, '');
							this.children[0].className = (lisDis === 'block') ? selStripped + ' selected' : selStripped;
							for (lisi = 1; lisi < lisLen; lisi += 1) {
								lis[lisi].style.display = lisDis;
							}
							return this;
		},
		initDisp	:	function (mainWrap) {
							var current = mainWrap.getElementsByClassName('fawjc-post-current')[0];
							if (current) {
								/* on single pages, just show the current month */
								current.style.display = current.style.display === 'block' ? 'none' : 'block';
								/*
								* inner showLis:
								*	of the current post (li) get the parent wrapper (ul) and then parent month (li)
								*	showLis will then show children (posts) of the same month the current post was published in
								* outer showLis:
								*	from the previous showLis it receives the month of the current post
								*	from there get parent wrapper (ul) and parent year (li)
								*	showLis will then show children (months) of the same year the current post was published in
								*/
								this.showLis.apply(this.showLis.apply(current.parentElement.parentElement).parentElement.parentElement);
							} else {
								/* show the most recent month of posts */
								/*
								* inner showLis:
								*	of the whole wrapper (ul.fawjc-year-wrap) get the first/recent year
								*	showLis will then show children (months)
								* outer showLis:
								*	from the previous showLis it receives the most recent year
								*	skip the arrow span (li>span) and get the month wrapper (li>ul)
								*	showLis will then show children (posts)
								*/
								this.showLis.apply(this.showLis.apply(mainWrap.children[0]).children[1].children[0]);
							}
		}
	};
	win.FAWJC.clicked = function (e) {
		/* handle clicks for year and month in one place */
		var evt = e || event, el = evt.srcElement || evt.target, doParent = (el.className.indexOf('fawjc-sel') !== -1);
		if (doParent || (el.className.indexOf('fawjc-year') !== -1) || (el.className.indexOf('fawjc-month') !== -1)) {
			evt.preventDefault();
			win.FAWJC.showLis.apply(doParent ? el.parentElement : el);
		}
	};
	var mainWraps = doc.getElementsByClassName('fawjc-year-wrap'), mwI = 0, mwLen = mainWraps.length;
	for (mwI = 0; mwI < mwLen; mwI += 1) {
		win.FAWJC.addClick(mainWraps[mwI], win.FAWJC.clicked);
		win.FAWJC.initDisp(mainWraps[mwI]);
	}
}(window, document));
