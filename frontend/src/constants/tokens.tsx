import Image from 'next/image';

import skiiImage from '@/assets/skii.png';

export const sKII = {
  name: 'sKII',
  symbol: 'sKII',
  decimals: 6,
  image: (
    <div className="w-[36px] h-[36px] relative">
      <Image
        src={skiiImage}
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
      <Image
        className="absolute left-0 right-0 top-2"
        src={skiiImage}
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36, filter: 'blur(8px)' }}
      />
    </div>
  ),
};
