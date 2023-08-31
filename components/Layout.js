import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

const Layout = ({ title, description, keywords, children }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
				<meta name='keywords' content={keywords} />
			</Head>
			<Navbar />
			{children}
		</>
	);
};

export default Layout;

Layout.defaultProps = {
	title: 'Property Rentals',
	description: 'Rental Properties for College Students',
	keywords: 'Rentals, Property, Student',
};
