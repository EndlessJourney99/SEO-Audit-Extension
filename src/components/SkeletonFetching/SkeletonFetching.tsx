import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

type props = {
    fetchUrl: string;
    loadingElem: JSX.Element;
    processResponseResult: (response: Response) => JSX.Element | JSX.Element[];
};

const SkeletonFetching = ({
    fetchUrl,
    loadingElem,
    processResponseResult,
}: props) => {
    const isLoading = useSignal(true);
    const error = useSignal(false);
    const responseResult = useSignal<Response | null>(null);
    useEffect(() => {
        isLoading.value = true;
        fetch(fetchUrl)
            .then((response) => (responseResult.value = response))
            .catch((e) => (error.value = true))
            .finally(() => (isLoading.value = false));
    }, []);

    return (
        <>
            {isLoading.value ? (
                loadingElem
            ) : !error.value ? (
                processResponseResult(responseResult.value!)
            ) : (
                <span className="font-bold text-red-500">Failed To Fetch</span>
            )}
        </>
    );
};

export default SkeletonFetching;
