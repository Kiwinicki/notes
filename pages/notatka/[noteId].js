import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BSON } from 'realm-web';
import useRealmStore from '../../hooks/useRealmStore';

const { ObjectId } = BSON;

export default function NotePage() {
	const router = useRouter();
	const { noteId } = router.query;

	const [thisNote, setThisNote] = useState(null);

	const notes = useRealmStore((state) => state.notes);
	const db = useRealmStore((state) => state.db);

	useEffect(() => {
		(async () => {
			const noteFromLocalState =
				notes && notes.find((note) => noteId === note._id.toString());
			if (noteFromLocalState) {
				setThisNote(noteFromLocalState);
			} else {
				if (db) {
					const fetchedNote = await db
						.collection('notes')
						.findOne({ _id: ObjectId(noteId) });
					setThisNote(fetchedNote);
				}
			}
		})();
	}, [db]);

	console.log(thisNote);

	return (
		// albo edytor dla admina lub home layout dla visitor
		<div>
			{thisNote && (
				<>
					{noteId} <h1>{thisNote.title}</h1>
					<p style={{ whiteSpace: 'pre' }}>{thisNote.content}</p>
				</>
			)}
		</div>
	);
}
