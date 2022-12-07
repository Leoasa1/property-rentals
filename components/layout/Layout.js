import React from 'react';
import Head from 'next/head';
import Navbar from '../navbar/Navbar';

const Layout = ({ title, description, keywords, children }) => {
	return (
		<div data-theme='bumblebee'>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
				<meta name='keywords' content={keywords} />
			</Head>
			<Navbar />
			{children}
		</div>
	);
};

export default Layout;

Layout.defaultProps = {
	title: 'Property Rentals',
	description: 'Rental Properties for College Students',
	keywords: 'Rentals, Property, Student',
};
