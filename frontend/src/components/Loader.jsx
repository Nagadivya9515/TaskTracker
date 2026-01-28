
export default function Loader() {
    return (
        // more beautiful version of loader using tailwind css
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-14 w-14"></div>
        </div>
    )
}