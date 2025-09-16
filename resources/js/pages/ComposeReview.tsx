type Props = {};

export default function ComposeReview({}: Props) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        const res = await fetch('/reviews', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': token,
            },
            body: form,
        });

        if (res.ok) {
            // success handling
        } else {
            // error handling
        }
    };
    return (
        <div>
            <h1>Compose Review</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" name="title" type="text" />
                </div>
                <div>
                    <label htmlFor="review">Content</label>
                    <textarea id="review" name="review" rows={5}></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
