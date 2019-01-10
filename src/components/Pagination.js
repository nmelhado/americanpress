import React from 'react';
import { Link } from 'react-router-dom';

export default ({ total, page, search, author }) => {
	console.log(`Search: ${search}, Author: ${author}`);
	const paginate = () => {
		let start = 0;
		let end = 0;
		let top = false;
		const maxPages = Math.ceil(total / 15);
		if (maxPages > 1) {
			start = page * 1 - 3;
			end = page * 1 + 3;
			if (start <= 1) {
				start = 1;
			}
			if (end >= maxPages) {
				end = maxPages;
				top = true;
			}
		}
		let pages = [];
		if (start > 1) {
			pages.push(
				<Link to={`/results/${search}/1${author ? `/${author}` : ''}`} key="a" className="pageNumbers">
					1
				</Link>
			);
			if (start > 2) {
				pages.push(
					<span key="adots" className="dots">
						...
					</span>
				);
			}
		}
		for (start; start <= end; start++) {
			if (start === page * 1) {
				pages.push(
					<span key={start} className="pageNumbers disabledNumber">
						{start}
					</span>
				);
			} else {
				pages.push(
					<Link
						key={start}
						to={`/results/${search}/${start}${author ? `/${author}` : ''}`}
						className="pageNumbers"
					>
						{start}
					</Link>
				);
			}
		}
		if (!top) {
			if (end < maxPages - 1) {
				pages.push(
					<span key="bdots" className="dots">
						...
					</span>
				);
			}
			pages.push(
				<Link
					to={`/results/${search}/${maxPages}${author ? `/${author}` : ''}`}
					key="b"
					className="pageNumbers"
				>
					{maxPages}
				</Link>
			);
		}
		return pages;
	};
	return (
		<div className="pages">
      {page > 1 ? (
        <Link
          className="pnButtonBottom previousBottom"
          to={`/results/${search}/${page * 1 - 1}${author ? `/${author}` : ''}`}
        >
          Previous Page
        </Link>
      ) : (
        ''
      )}
			{paginate()}
			{page * 15 < total ? (
				<Link
					className="pnButtonBottom nextBottom"
					to={`/results/${search}/${page * 1 + 1}${author ? `/${author}` : ''}`}
				>
					Next Page
				</Link>
			) : (
				''
			)}
		</div>
	);
};
