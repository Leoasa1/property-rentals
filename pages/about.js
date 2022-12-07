import React from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

const about = () => {
	return (
		<Layout>
			<Link href={'/rentals'}>test</Link>about
		</Layout>
	);
};

export default about;
