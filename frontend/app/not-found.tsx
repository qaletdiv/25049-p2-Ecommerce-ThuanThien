import Link from "next/link";
export default function NotFoundPage(){
    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
            <h1 className="text-3xl font-semibold">Không tìm thấy trang</h1>
            <p className="text-muted">Trang bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/" className="mt-2 bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                Về trang chủ
            </Link>
        </div>
    )
}
