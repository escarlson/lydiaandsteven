import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faMountain, faSpa, faChild } from "@fortawesome/free-solid-svg-icons";

export default function ThingsToDo() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Things to Do in Santa Fe</h1>
          <p>Santa Fe is a vibrant city with a rich cultural heritage, stunning architecture, and a thriving arts scene. Here are some recommendations for things to do during your visit:</p>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title"><FontAwesomeIcon className="button-icon me-2" icon={faPalette} />Cultured</h2>
                  <div className="card-text">
                    <ul>
                      <li>
                        <p className="mb-0"><strong>Downtown Santa Fe</strong></p>
                        <p>Wander the narrow old streets of downtown Santa Fe and check out the shops, street vendors, and cafes. <Link href={"https://www.okeeffemuseum.org/"} target="_blank">The Georgia O’Keeffe Museum</Link>, the historic <Link href={"https://www.cbsfa.org/"} target="_blank">Cathedral Basilica of Saint Francis of Assisi</Link>, and the <Link href={"https://www.lorettochapel.com/"} target="_blank">Loretto Chapel</Link> are popular tourist stops. Lydia’s favorite museums downtown are the <Link href={"https://www.nmartmuseum.org/"} target="_blank">New Mexico Museum of Art</Link> and the <Link href={"https://iaia.edu/mocna/"} target="_blank">IAIA Museum of Contemporary Native Arts</Link>.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong>Canyon Road</strong></p>
                        <p>Adjacent to downtown Santa Fe, Canyon Road is famous for its dense concentration of art galleries. Eat brunch at <Link href={"https://www.santafeteahouse.com/"} target="_blank">The Teahouse</Link>!</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong>Museum Hill</strong></p>
                        <p>A little village of museums, all in one place! Definitely check out the <Link href={"https://www.moifa.org/"} target="_blank">Museum of International Folk Art</Link> and the <Link href={"https://visitsfbg.org/"} target="_blank">Santa Fe Botanical Garden</Link>. If you have time, other museums on the hill are the <Link href={"https://www.indianartsandculture.org/"} target="_blank">Museum of Indian Arts & Culture</Link>, <Link href={"https://nmheritagearts.org/"} target="_blank">Nuevo Mexicano Heritage Arts Museum</Link>, and the <Link href={"https://wheelwright.org/"} target="_blank">Wheelwright Museum of the American Indian</Link>.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://meowwolf.com/visit/santa-fe"} target="_blank">Meow Wolf: House of Eternal Return</Link></strong></p>
                        <p>The original Meow Wolf art collective, before they got too big for their own good. A mind-bending labyrinth of immersive, otherworldly art installations.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title"><FontAwesomeIcon className="button-icon me-2" icon={faMountain} />Crunchy</h2>
                  <div className="card-text">
                    <ul>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://www.blm.gov/visit/diablo-canyon"} target="_blank">Diablo Canyon</Link></strong></p>
                        <p>Gorgeous cliffs offer world-class rock climbing. Or, walk along the canyon floor to the Rio Grande and soak your feet in the river. A short 20 minutes from Santa Fe.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://earthship.com/visit/"} target="_blank">Taos Earthships</Link></strong></p>
                        <p>We highly recommend taking the official guided tour ($22/adult; so worth it!) which is offered at 3:00pm every day. Taos is about a 1hr drive from Santa Fe. While you’re in Taos, hike into the Rio Grande Gorge and soak in Black Rock Hot Springs or Manby Hot Springs along the river! On the drive back from Taos, stop at one of the many mom-and-pop wineries dotting the river canyon along NM-68.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://www.nps.gov/band/index.htm"} target="_blank">Bandelier National Monument</Link></strong></p>
                        <p>A 30min drive from Santa Fe. Explore the beautiful Ancestral Pueblo cliff dwellings and meandering trails.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://www.blm.gov/visit/la-cieneguilla-petroglyphs"} target="_blank">La Cieneguilla Petroglyphs</Link></strong></p>
                        <p>It’s absolutely crazy that the tourists haven’t discovered this yet. There are hundreds of petroglyphs etched into the rock walls and hidden nooks, unprotected by plexiglass or ropes. You can just walk/climb right up to them. It’s a 1 mile hike to get to them, and involves a lot of scrambling over boulders on an unmarked “trail”.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title"><FontAwesomeIcon className="button-icon me-2" icon={faSpa} />Chill</h2>
                  <div className="card-text">
                    <ul>
                      <li>
                        <p className="mb-0"><strong>Hot Springs + Bathhouses</strong></p>
                        <p>For fancy resort hot springs, check out <Link href={"https://ojosparesorts.com/ojo-santa-fe/"} target="_blank">Ojo Santa Fe</Link> (day passes are $50/person) or even better, drive 45 minutes north to <Link href={"https://ojosparesorts.com/ojo-caliente/soak/"} target="_blank">Ojo Caliente</Link> (better variety of mineral springs). Both Ojos are kid-free and bathhouses at each location offer saunas, spa treatments, etc. For a Japanese-style bathhouse in the Santa Fe foothills, go to <Link href={"https://tenthousandwaves.com/"} target="_blank">Ten Thousand Waves</Link>. Sadly, they no longer offer day soaking to the public, but you can reserve private soaks or small group soaks. </p>
                        <p>For public, undeveloped hot springs in the wild, Lydia’s number one pick is <Link href={"https://www.fs.usda.gov/r03/santafe/recreation/san-antonio-hot-springs"} target="_blank">San Antonio Hot Springs</Link> in the Santa Fe National Forest, about a 1.5 hr drive from Santa Fe. Cascading water in terraced rock pools surrounded by wildflowers and forest! Yes please. It’s about a 1 mile hike to get to the springs if the access road is open; if the access road is closed for deer mating season, then it is a 5 mile hike. Clothing is optional. (Note that you will be driving through a sector of Los Alamos National Laboratory to get to the trailhead, so expect to be stopped at security checkpoints en route: bring your photo ID and do not have any federally illegal substances in your car.)</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://www.reunityresources.com/"} target="_blank">Reunity Resources Community Farm</Link></strong></p>
                        <p>A little slice of heaven, Reunity Resources offers a delightful farm stand with fresh produce and locally-made goods, and hosts lots of live music and events during the summer/fall months.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://kakawachocolates.com/"} target="_blank">Kakawa Chocolate House</Link></strong></p>
                        <p>A mouth-watering menu of drinking chocolates, including Mayan/Aztec/Mesoamerican, European, and Contemporary elixirs. The one on Paseo de Peralta is their cutest location.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://santafefarmersmarket.com/"} target="_blank">Santa Fe Farmer’s Market</Link></strong></p>
                        <p>Located in the up-and-coming Railyard District, the Farmer’s Market on Tuesdays and Saturdays has tons of booths ranging from pastries to produce and lavender to lattes. Concurrent with the Farmer’s Market on Saturdays is the Railyard Artisan Market across the street.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title"><FontAwesomeIcon className="button-icon me-2" icon={faChild} />Children</h2>
                  <div className="card-text">
                    <ul>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://randalldavey.audubon.org/nature-discovery-area"} target="_blank">The Randall Davey Audubon Center & Sanctuary</Link></strong></p>
                        <p>Dude, they have a giant treehouse playground. It’s so dang whimsical. Kids can also build their own forts out of tree branches or chill in hammock nests. Bring a picnic! And, it’s totally free.</p>
                      </li>
                      <li>
                        <p className="mb-0"><strong><Link href={"https://santafechildrensmuseum.org/"} target="_blank">Santa Fe Children’s Museum</Link></strong></p>
                        <p>Jam-packed with interactive play-based exhibits and make-believe areas. Outside, The Backyard offers a place to run around, climb, and discover. Let ‘em loose!</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}