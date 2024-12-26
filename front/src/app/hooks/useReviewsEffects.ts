import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import debounce from 'lodash.debounce';
import { ColumnFilter } from '@tanstack/react-table';
import { encodeSortingToBase64 } from '../utils/base64';
import { useReviewsContext } from '../context/ReviewsContext';

export const useReviewsEffects = () => {
    const { fetchReviews, loading, setLoading, setPage, filters, sorting, page, pagination } = useReviewsContext();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && pagination.totalPages < page) {
          setPage(1);
          if (pagination.totalPages > 0) {
            setLoading(true);
          }
          return () => undefined;
        }
        return () => undefined;
      }, [pagination, page, setPage, setLoading, loading]);

    useEffect(() => {
        const debouncedUpdate = debounce(() => {
            const params = new URLSearchParams();
            filters.forEach(({ id, value }: ColumnFilter) => {
                if (value && (!Array.isArray(value) || value.length > 0)) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => params.append(id, v.toString()));
                    } else {
                        params.set(id, value as string);
                    }
                }
            });

            if (sorting.length > 0) {
                params.set("sorting", encodeSortingToBase64(sorting));
            }

            params.set("page", page.toString());
            const newUrl = `${pathname}?${params.toString()}`;
            window.history.replaceState(null, "", newUrl);
        }, 500);

        debouncedUpdate();

        return () => debouncedUpdate.cancel();
    }, [filters, sorting, page, pathname]);

    useEffect(() => {
        const debouncedUpdate = debounce(() => {
            const author = searchParams.get("author") || "";
            const rating = searchParams.getAll("rating").map((r) => parseInt(r, 10));
            const sorting = searchParams.get("sorting") as string;
            const page = parseInt(searchParams.get("page") || "1", 10);
            
            // TODO: rewrite depends
            // eslint-disable-next-line react-hooks/exhaustive-deps
            fetchReviews(page, {
                author: author,
                rating: JSON.stringify(rating),
                sorting,
            });
        }, 1000);
        debouncedUpdate();

        return () => debouncedUpdate.cancel();
    }, [searchParams]);
};
