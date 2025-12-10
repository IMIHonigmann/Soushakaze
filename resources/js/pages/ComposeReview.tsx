import { router } from '@inertiajs/react';

type Props = {};

export default function ComposeReview({}: Props) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        router.post(route('send-review'), {
            title: form.get('title'),
            review: form.get('review'),
            weapon_id: form.get('weapon_id'),
            rating: form.get('rating'),
        });
    };

    return (
        <>
            <h1>Compose Review</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" name="title" type="text" />
                </div>
                <div>
                    <label htmlFor="review">Content</label>
                    <textarea id="review" name="review" rows={5}></textarea>
                    <input type="number" name="weapon_id" placeholder="Weapon ID" />
                    <input type="number" name="rating" placeholder="Rating" min={1} max={5} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}
