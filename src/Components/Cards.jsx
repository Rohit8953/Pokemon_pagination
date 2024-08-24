import { IoIosArrowBack } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";

const Cards = () => {
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState(1);
  const [searchvalue, setsearchvalue] = useState();
  const [nmuberofpages, setnumberofpages] = useState();
  const [paginationlength, setpaginationlength] = useState(1);
  const [loader, setloader] = useState(false);

  const array = Array(20).fill();

  const fetchdata = async () => {
    try {
      setloader(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${counts}&limit=20`
      );
      const Data = await response.json();
      setnumberofpages(Data.count);
      const detailedDataPromises = Data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      });
      const detailedData = await Promise.all(detailedDataPromises);
      setData(detailedData);
      setloader(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [counts]);

  useEffect(() => {
    if (searchvalue) {
      const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchvalue.toLowerCase())
      );
      setData(filteredData);
    } else {
      fetchdata();
    }
  }, [searchvalue]);

  console.log("seached pokemon is there", data, data.length);

  const previouscount = () => {
    setCounts((prevcount) =>
      prevcount === 0 ? nmuberofpages - 1 : prevcount - 1
    );
  };
  const nextcount = () => {
    setCounts((prevcount) =>
      prevcount === nmuberofpages - 1 ? 0 : prevcount + 1
    );
  };

  const previouscount2 = () => {
    setCounts((prevcount) => (prevcount === 0 ? 0 : prevcount - 1));
    setpaginationlength((prevcount) => (prevcount === 0 ? 0 : prevcount - 1));
  };
  const nextcount2 = () => {
    setCounts((prevcount) =>
      prevcount === nmuberofpages - 1 ? nmuberofpages - 1 : prevcount + 1
    );
    setpaginationlength((prevcount) =>
      prevcount === nmuberofpages - 1 ? nmuberofpages - 1 : prevcount + 1
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl  lg:px-8">
        <div>
          <input
            type="text"
            onChange={(e) => setsearchvalue(e.target.value)}
            placeholder="search"
            className="outline-none bg-slate-200 p-2 mb-5 rounded-md border-2 border-slate-300"
            value={searchvalue}
          />
        </div>

        <span className="text-2xl tracking-tight text-gray-900 ">
          No of Items {"  "}
        </span>
        <span className="text-2xl  tracking-tight text-gray-900">
          { data.length===0?(<span className="text-xl">Not found</span >):data.length}
        </span>

        {/* Search bar ---------*/}

        <div className="h-full">
          {loader || data.length === 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-x-6  gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {array.map((pokemon, index) => (
                <div
                  key={index}
                  className="group relative w-[17rem] h-[20rem] mt-5"
                >
                  <div className="animate-pulse rounded-t-md h-full w-full bg-gray-200"></div>
                  <h3 className="animate-pulse  rounded-b-md pb-4 h-9 w-full bg-gray-200"></h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 min-h-screen gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {data.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="group relative cursor-pointer "
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={
                        pokemon.sprites.other["official-artwork"].front_default
                      }
                      alt={pokemon.name}
                      loading="lazy"
                      className="h-full w-full object-cover  lg:h-full lg:w-full"
                    />
                  </div>

                  <div className="">
                    <h3 className=" text-gray-700 text-2xl line-clamp-1 text-center rounded-b-md pb-4 bg-slate-200">
                      {pokemon.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          {/* FOR MOBILE RESPONSIVENESS */}
          <div className="flex flex-1 justify-between sm:hidden mt-10">
            <div
              onClick={previouscount}
              className="relative inline-flex items-center cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </div>

            <div
              href="#"
              onClick={nextcount}
              className="relative ml-3 inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </div>
          </div>

          {/* FOR PC  RESPONSIVENESS*/}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-10">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{counts} page</span>/
                <span className="font-medium">{nmuberofpages}</span> results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm cursor-pointer"
              >
                <div className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <IoIosArrowBack
                    onClick={previouscount2}
                    className="h-5 w-5"
                  />
                </div>

                <div
                  onClick={() => setCounts(paginationlength)}
                  style={
                    paginationlength === counts
                      ? {
                          zIndex: 10,
                          backgroundColor: "#4f46e5",
                          outline: "1px solid #4f46e5",
                        }
                      : undefined
                  }
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {paginationlength}
                </div>
                <div
                  onClick={() => setCounts(paginationlength + 1)}
                  style={
                    paginationlength + 1 === counts
                      ? {
                          zIndex: 10,
                          backgroundColor: "#4f46e5",
                          outline: "1px solid #4f46e5",
                        }
                      : undefined
                  }
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {paginationlength + 1}
                </div>
                <div
                  onClick={() => setCounts(paginationlength + 2)}
                  style={
                    paginationlength + 2 === counts
                      ? {
                          zIndex: 10,
                          backgroundColor: "#4f46e5",
                          outline: "1px solid #4f46e5",
                        }
                      : undefined
                  }
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                >
                  {paginationlength + 2}
                </div>

                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  ...
                </span>

                <div
                  onClick={() => setCounts(nmuberofpages - 3)}
                  style={
                    nmuberofpages - 3 === counts
                      ? {
                          zIndex: 10,
                          backgroundColor: "#4f46e5",
                          outline: "1px solid #4f46e5",
                        }
                      : undefined
                  }
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                >
                  {nmuberofpages - 3}
                </div>
                <div
                  onClick={() => setCounts(nmuberofpages - 2)}
                  style={
                    nmuberofpages - 2 === counts
                      ? {
                          zIndex: 10,
                          backgroundColor: "#4f46e5",
                          outline: "1px solid #4f46e5",
                        }
                      : undefined
                  }
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {nmuberofpages - 2}
                </div>
                <div
                  onClick={() => setCounts(nmuberofpages - 1)}
                  style={
                    nmuberofpages - 1 === counts
                      ? {
                          zIndex: 10,
                          backgroundColor: "#4f46e5",
                          outline: "1px solid #4f46e5",
                        }
                      : undefined
                  }
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {nmuberofpages - 1}
                </div>
                <div className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <IoIosArrowBack
                    onClick={nextcount2}
                    className="h-5 w-5 rotate-180"
                  />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cards;
