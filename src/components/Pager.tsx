import { Component, createMemo, For } from "solid-js";
import { Page } from "@molgenis/vip-report-api";

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

export type PageChangeEvent = { page: number };
export type PageChangeCallback = (event: PageChangeEvent) => void;

export const Pager: Component<{
  page: Page;
  onPageChange: PageChangeCallback;
}> = (props) => {
  const nrPages = createMemo(() => Math.ceil(props.page.totalElements / props.page.size));
  const pages = createMemo(() => createPages(props.page.number, nrPages()));
  const page = createMemo(() => props.page);

  return (
    <>
      {page().totalElements > page().size && (
        <nav class="pagination is-centered">
          <ul class="pagination-list">
            <li>
              <a
                classList={{ "pagination-previous": true, "is-invisible": page().number === 0 }}
                onClick={page().number > 0 ? () => props.onPageChange({ page: page().number - 1 }) : undefined}
              >
                Previous
              </a>
            </li>
            <For each={pages()}>
              {(currentPage) =>
                currentPage !== null ? (
                  <a
                    classList={{ "pagination-link": true, "is-current": currentPage === page().number }}
                    onClick={() =>
                      currentPage !== page().number ? props.onPageChange({ page: currentPage }) : undefined
                    }
                  >
                    {currentPage + 1}
                  </a>
                ) : (
                  <span class="pagination-ellipsis">&hellip;</span>
                )
              }
            </For>
            <li>
              <a
                classList={{ "pagination-next": true, "is-invisible": page().number === nrPages() - 1 }}
                onClick={
                  page().number < nrPages() - 1 ? () => props.onPageChange({ page: page().number + 1 }) : undefined
                }
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};
