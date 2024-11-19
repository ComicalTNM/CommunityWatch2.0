// app/components/RequestFlashcard.tsx
import Link from 'next/link';

interface RequestFlashcardProps {
  id: string;
  title: string;
  imageUrl: string;
  nonprofitId: string;
}

const RequestFlashcard = ({ id, title, imageUrl, nonprofitId }: RequestFlashcardProps) => {
  return (
    <Link href={`/nonprofit/${nonprofitId}/request/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default RequestFlashcard;