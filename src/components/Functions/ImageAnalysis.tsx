import { Signal, useSignal } from '@preact/signals';
import { DocumentInfo, HTMLImage } from '../../types/Execution';
import { GlobalSignal } from '../../signals/globalSignal';
import { useContext, useEffect } from 'preact/hooks';
import { AppState } from '../../signals/globalContext';
import { ScrollToElem, TriggerHighlight } from '../../utils/SendCommand';
import SkeletonFetching from '../SkeletonFetching/SkeletonFetching';
import { CreateGuid } from '../../utils/GlobalUtils';
import ArrowDownward from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowUpward from '@mui/icons-material/ArrowDropUpOutlined';

type props = {
    docsInfo: Signal<DocumentInfo | null>;
};

const handleResponseResult = (
    response: Response,
    id: string,
    fetchedData: Signal<Array<{ uniqueId: string; size: number }>>
) => {
    const returnElem: JSX.Element | JSX.Element[] = [];
    if (response.ok) {
        returnElem.push(
            <td>
                <span className="italic font-mono bg-green-400 py-1 px-4 rounded-md mr-2">
                    {response.status}
                </span>
            </td>
        );
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
            const lengthNumber = parseInt(contentLength, 10);
            if (!Number.isNaN(lengthNumber)) {
                returnElem.push(
                    <td data-val={lengthNumber}>
                        <span className="italic font-mono">
                            {Math.ceil(lengthNumber / 1000)} KB
                        </span>
                    </td>
                );
            }
            fetchedData.value.push({ uniqueId: id, size: lengthNumber });
        } else {
            returnElem.push(<td></td>);
            fetchedData.value.push({ uniqueId: id, size: 0 });
        }
    } else {
        returnElem.push(
            <>
                <td>
                    <span className="italic font-mono bg-red-400 py-1 px-4 rounded-md mr-2">
                        {response.status}
                    </span>
                </td>
                <td></td>
            </>
        );
        fetchedData.value.push({ uniqueId: id, size: 0 });
    }

    return returnElem;
};

const loadingElem = (
    <td colSpan={2}>
        <div role="status" className="flex flex-wrap justify-center w-full">
            <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>
            <div className="w-full"></div>
        </div>
    </td>
);

const ImageAnalysis = ({ docsInfo }: props) => {
    const state: GlobalSignal = useContext(AppState);
    const rowData = useSignal<JSX.Element[]>([]);
    const isSort = useSignal(false);
    const fetchedData = useSignal<Array<{ uniqueId: string; size: number }>>(
        []
    );
    const constructTable = () => {
        const row: JSX.Element[] = [];
        const currentUrl = new URL(state.tabInfo.value.url ?? '');

        docsInfo.value?.imageTags.map((item) => {
            let fetchUrl = item.src;
            if (
                fetchUrl &&
                !fetchUrl.startsWith('data:image/') &&
                !fetchUrl.includes('http') &&
                !fetchUrl.includes('www')
            )
                fetchUrl = `${currentUrl.protocol}//${currentUrl.hostname}/${
                    fetchUrl.startsWith('/') ? fetchUrl.substring(1) : fetchUrl
                }`;

            const id = CreateGuid();
            row.push(
                <tr
                    onMouseOver={() =>
                        TriggerHighlight(
                            item.uniqueId,
                            state.tabInfo.value.id ?? -1,
                            true
                        )
                    }
                    onMouseLeave={() =>
                        TriggerHighlight(
                            item.uniqueId,
                            state.tabInfo.value.id ?? -1,
                            false
                        )
                    }
                    onClick={() =>
                        ScrollToElem(
                            item.uniqueId,
                            state.tabInfo.value.id ?? -1
                        )
                    }
                    key={id}
                >
                    <td title={fetchUrl}>
                        {fetchUrl.length > 80
                            ? `${fetchUrl.substring(0, 80)}...`
                            : fetchUrl}
                    </td>
                    {/* <td className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.src}
                </td> */}
                    <td>{item.alt}</td>
                    <td>{item.width}</td>
                    <td>{item.height}</td>

                    <SkeletonFetching
                        loadingElem={loadingElem}
                        fetchUrl={fetchUrl}
                        processResponseResult={handleResponseResult}
                        callBackArgs={[id, fetchedData]}
                    />
                </tr>
            );
        });
        rowData.value = row;
        // row[0].
    };

    useEffect(() => {
        constructTable();
    }, []);

    useEffect(() => {
        if (fetchedData.value.length === rowData.value.length) {
            fetchedData.value.sort((a, b) => {
                if (isSort.value) return b.size - a.size;
                return a.size - b.size;
            });
            const cloneRowData = [...rowData.value];
            const sortedRowData = new Array<JSX.Element>();
            for (let i = 0; i < fetchedData.value.length; i++) {
                const id = fetchedData.value[i].uniqueId;
                const findItem = cloneRowData.find((i) => i.key === id);
                if (findItem) {
                    sortedRowData.push(findItem!);
                }
            }
            rowData.value = sortedRowData;
        }
    }, [isSort.value]);

    return (
        <section key="ImageAnalysis">
            <table className="table-fixed w-full [&>thead>tr>td]:font-bold [&>thead>tr>td]:px-2 [&>tbody>tr]:cursor-pointer [&>tbody>tr]:border-b [&>tbody>tr:hover]:bg-blue-100 [&>tbody>tr>td]:px-2 [&>tbody>tr>td:first-child]:break-all [&>tbody>tr>td:nth-child(2)]:italic [&>tbody>tr>td]:p-3">
                <thead>
                    <tr>
                        <td className="w-1/4">URL</td>
                        <td>Alt</td>
                        <td className="w-[70px]">Width</td>
                        <td className="w-[70px]">Height</td>
                        <td className="w-[70px]">Status</td>
                        <td
                            className="w-[100px] cursor-pointer hover:bg-slate-300 rounded-md p-3"
                            onClick={() => (isSort.value = !isSort.value)}
                        >
                            Size{' '}
                            {isSort.value ? <ArrowDownward /> : <ArrowUpward />}
                        </td>
                    </tr>
                </thead>
                <tbody>{rowData.value}</tbody>
            </table>
        </section>
    );
};

export default ImageAnalysis;
