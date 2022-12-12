import React from 'react';
import Link from 'next/link';

const Navbar = () => {
	return (
		<div className='navbar bg-base-100 px-10'>
			<div className='flex-1'>
				<Link href={'/'} className='normal-case text-3xl playfair'>
					Rentals
				</Link>
			</div>
			<div className='flex-none'>
				<ul className='flex flex-row gap-6 p-0'>
					<li>
						<Link href={'/about'}>About</Link>
					</li>
					<li>
						<a
							href='https://github.com/Leoasa1/property-rentals'
							target='_blank'
							rel='noreferrer'
						>
							Github
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Navbar;
