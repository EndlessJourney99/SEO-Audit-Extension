import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

type props = {
    fetchUrl: string;
    loadingElem: JSX.Element;
    processResponseResult: (
        response: Response,
        ...rest: any[]
    ) => JSX.Element | JSX.Element[];
    callBackArgs?: any[];
};

const SkeletonFetching = ({
    fetchUrl,
    loadingElem,
    processResponseResult,
    callBackArgs,
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
                processResponseResult(
                    responseResult.value!,
                    ...(callBackArgs ?? [])
                )
            ) : (
                <span className="font-bold text-red-500">Failed To Fetch</span>
            )}
        </>
    );
};

export default SkeletonFetching;
