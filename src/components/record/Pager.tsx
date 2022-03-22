import { Component, For } from "solid-js";
import { Page } from "../../api/Api";

const createPages = (page: number, pages: number): (number | null)[] => {
  if (pages <= 5) {
    return [...Array(pages).keys()];
  } else if (page < 3) {
    return [0, 1, 2, null, pages - 1];
  } else if (page > pages - 4) {
    return [0, null, pages - 3, pages - 2, pages - 1];
  } else {
    return [0, null, page, null, pages - 1];
  }
};

export const Pager: Component<{
  page: Page;
  onPageChange: (page: number) => void;
}> = (props) => {
  const currentPage = props.page.number;
  const nrPages = Math.ceil(props.page.totalElements / props.page.size);
  const pages = createPages(currentPage, nrPages);

  return (
    props.page.totalElements > props.page.size && (
      <nav class="pagination is-centered">
        <ul class="pagination-list">
          <li>
            <a
              classList={{ "pagination-previous": true, "is-invisible": currentPage === 0 }}
              onClick={currentPage > 0 ? () => props.onPageChange(currentPage - 1) : undefined}
            >
              Previous
            </a>
          </li>
          <For each={pages}>
            {(page) =>
              page !== null ? (
                <a
                  classList={{ "pagination-link": true, "is-current": page === currentPage }}
                  onClick={page !== currentPage ? () => props.onPageChange(page) : undefined}
                >
                  {page + 1}
                </a>
              ) : (
                <span class="pagination-ellipsis">&hellip;</span>
              )
            }
          </For>
          <li>
            <a
              classList={{ "pagination-next": true, "is-invisible": currentPage === nrPages - 1 }}
              onClick={currentPage < nrPages - 1 ? () => props.onPageChange(currentPage + 1) : undefined}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    )
  );
};
