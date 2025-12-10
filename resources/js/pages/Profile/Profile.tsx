import { FaCamera } from 'react-icons/fa';

type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    user: User;
};

export default function Profile({ user }: Props) {
    return (
        <div>
            <h2>Welcome back {user.name}</h2>
            <span className="inline-block rounded-full border-2 p-8">
                <FaCamera />
            </span>
            <li className="mb-5">
                <strong>Joined in:</strong> {new Date(user.created_at).toLocaleDateString()}
            </li>
            <ul>
                <li>
                    <strong>Email:</strong> {user.email}
                </li>
                <li>
                    <strong>Email Verified At:</strong> {user.email_verified_at ?? 'Not verified'}
                </li>
            </ul>
        </div>
    );
}
