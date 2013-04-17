(function (doc, undefined) {
	var main_wrap = doc.getElementsByClassName('fawjc-year-wrap')[0],
		current = doc.getElementById('fawjc_post_current');
	function add_click(el, fun) {
		if (el.addEventListener) {
			el.addEventListener('click', fun, false);
		} else if (el.attachEvent) {
			el.attachEvent('onclick', fun);
		}
	}
	function show_lis() {
		/* the first child [0] will be a span, used to hold the arrows, so we start with 1 */
		var lis = this.children,
			lisi = 1, lis_len = lis.length,
			lis_dis = (lis[1]) ? (lis[1].style.display === 'block' ? 'none' : 'block') : '',
			sel_stripped = this.children[0].className.replace(/ selected/gi, '');
		this.children[0].className = (lis_dis === 'block') ? sel_stripped + ' selected' : sel_stripped;
		for (; lisi < lis_len; lisi += 1) {
			lis[lisi].style.display = lis_dis;
		}
		return this;
	}
	if (current) {
		/* on single pages, just show the current month */
		current.style.display = current.style.display === 'block' ? 'none' : 'block';
		/*
		 * inner show_lis:
		 *	of the current post (li) get the parent wrapper (ul) and then parent month (li)
		 *	show_lis will then show children (posts) of the same month the current post was published in
		 * outer show_lis:
		 *	from the previous show_lis it receives the month of the current post
		 *	from there get parent wrapper (ul) and parent year (li)
		 *	show_lis will then show children (months) of the same year the current post was published in
		 */
		show_lis.apply(show_lis.apply(current.parentElement.parentElement).parentElement.parentElement);
	} else {
		/* show the most recent month of posts */
		/*
		 * inner show_lis:
		 *	of the whole wrapper (ul.fawjc-year-wrap) get the first/recent year
		 *	show_lis will then show children (months)
		 * outer show_lis:
		 *	from the previous show_lis it receives the most recent year
		 *	skip the arrow span (li>span) and get the month wrapper (li>ul)
		 *	show_lis will then show children (posts)
		 */
		show_lis.apply(show_lis.apply(main_wrap.children[0]).children[1].children[0]);
	}
	/* handle clicks for year and month in one place */
	add_click(main_wrap, function (e) {
		var evt = e || event, el = evt.srcElement || evt.target, do_parent = (el.className.indexOf('fawjc-sel') !== -1);
		if (do_parent || (el.className.indexOf('fawjc-year') !== -1) || (el.className.indexOf('fawjc-month') !== -1)) {
			evt.preventDefault();
			show_lis.apply(do_parent ? el.parentElement : el);
		}
	});
}(document));
