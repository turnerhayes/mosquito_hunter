const HowToBuildTrapsPage = () => {
    return (
        <>
            <header>
                <h1 className="text-2xl underline text-center">
                    How to Build a Mosquito Trap
                </h1>
            </header>
            <section className="p-6">
                <div className="border-2 rounded p-2 mb-2">
                    <p>
                        Ingredients:
                    </p>
                    <ul className="list-disc list-inside">
                        <li>2 liter Plastic bottle</li>
                        <li>A knife to cut the bottle</li>
                        <li>250ml water</li>
                        <li>200g sugar</li>
                        <li>3.5g active dry yeast</li>
                        <li>Tape or glue</li>
                        <li>Dark paper or cloth (optional)</li>
                    </ul>
                </div>
                <div className="border-2 rounded p-2 mb-2">
                    <ol className="list-decimal list-inside">
                        <li>
                            Cut the top off the plastic bottle.
                        </li>
                        <li>
                            Mix 250ml water and the sugar in the bottom of the bottle until thoroughly combined. To help the sugar dissolve better, make the water warm (but not boiling) before mixing.
                        </li>
                        <li>
                            Stir in the yeast.
                        </li>
                        <li>
                            Turn the top of the bottle that you cut off in step 1 upside down in the bottle so that the neck is pointing at the mixture in the bottle.
                        </li>
                        <li>
                            Tape or glue the top in place.
                        </li>
                        <li>
                            (Optional) To make the trap work better, wrap the bottle in a black or dark colored paper or cloth so that the sides of the bottle are covered.
                        </li>
                        <li>
                            Place the trap and wait.
                        </li>
                    </ol>
                </div>
                <div className="border-2 rounded p-2">
                    <p>
                        This trap works by releasing carbon dioxide gas (CO2).
                        Mosquitoes are attracted to CO2 because humans and
                        other animals breathe it out. The reaction of the sugar
                        and yeast releases the gas, and mosquitoes come into
                        the trap to feed. When they enter the trap, most of
                        them are unable to fly out through the narrow neck of
                        the bottle, and they eventually die.
                    </p>
                    <p>
                        Wrapping the trap in dark material like cloth or paper
                        makes the trap more appealing to mosquitoes because
                        mosquitoes prefer to hide in dark places.
                    </p>
                </div>
            </section>
        </>
    );
};

export default HowToBuildTrapsPage;
