import Image from 'next/image';
import weddingAtCana from "@/public/wedding-at-cana-dionisy-the-wise.jpg";

export default function Guide() {
  return (
    <div>
      <main>
        <div className="container">
          <h1>Guide to the Orthodox Wedding Ceremony</h1>
          <p>First time at an Orthodox wedding? Never fear! We wrote this guide so you can better understand what&lsquo;s going on during the ceremony.</p>
          <figure className="figure mb-4">
            <Image
              src={weddingAtCana}
              alt="Russian icon of the Wedding at Cana"
              width={440}
              height={442}
              className="figure-img img-fluid rounded"
            />
            <figcaption className="figure-caption">Workshop of Dionisy the Wise (Russian), The Wedding at Cana, 1502, fresco. Ferapontov Monastery, Ferapontovo, Russia.</figcaption>
          </figure>
          <h2>The Betrothal</h2>
          <p>
            The bride and groom begin together in the back of the church in an area called the narthex. The narthex is an antechamber to the church proper and is a transitional space from the world outside to the mystical, atemporal realm within the church. Here, the bride and groom assert that they have come of “good, free, and unconstrained will” to be wed to their spouse. This is the closest that Orthodox get to saying vows or saying “I do”. This is also where the rings are exchanged, as symbols of fidelity, honor, and trust.* In the exchange of rings, it is acknowledged that the weaknesses of one partner will be compensated by the strengths of the other. The placing of a ring on one&apos;s right finger also references the Prodigal Son&apos;s entry into the joyous feast of his Father and the invitation to “eat and be merry.” The couple receives candles as symbols of the light of Christ and the hesychastic illumination we seek in theosis (union with God). From the narthex, the priest then leads the bride and groom into the nave, the heart of the communal church.
          </p>
          <p>
            *Steven and Lydia have chosen Möbius rings, as a further symbol of their metaphysical and eternal union and the paradoxical nature of love.
          </p>
          <h2>Koumbaro/Koumbara (Sponsors)</h2>
          <p>In Orthodox weddings, the bride and groom are accompanied by a koumbaro and koumbara chosen by the couple as sponsors of their marriage. The koumbaro/a are different from a “best man” or “maid of honor” as seen in Western wedding traditions. Rather, they are like the “godparents” of the wedding, and seen as role models and a resource for the couple throughout their married life. The koumbaro and koumbara are tasked with praying for the couple in all the years to come.</p>
          <h2>The Crowning</h2>
          <p>
            The pinnacle of the Orthodox wedding ceremony is the Crowning. The bride and groom are crowned as king and queen of their kingdom, and called to a life of benevolent stewardship — of their household, of each other, of the environment in which they dwell, and as members of their community. The crowns are connected together by a ribbon.
          </p>
          <p>
            On this joyful day, they are honored as royalty, and they will keep their wedding crowns for the remainder of their lives. Contrary to modern notions of “til death do us part”, marriage is viewed as eternal and active even beyond the constraints of this life. In some Orthodox traditions, upon the death of one of the spouses, the ribbon connecting the crowns is cut and the deceased is buried with the wedding crown of their partner, in the expectation that they will return the crown to their partner when both are reunited in the afterlife.
          </p>
          <p>
            The crowns are revered as crowns of royalty, but also as crowns of martyrdom. In early Christian times, and in the centuries since, martyrs were recognized as receiving spiritual crowns of victory, stemming from the ancient Roman practice of bestowing laurel wreath crowns upon athletic victors. Wearing crowns of martyrdom, the bride and groom give their lifeforce to each other, even while remaining discrete persons. They recognize the struggles that lie ahead and are prepared to die for one another in mutual martyrdom. Strengthened in Christ, they will face both immense joy and immense hardship together, side by side.
          </p>
          <h2>Epistle Reading and Gospel Reading</h2>
          <p>
            There are two readings from the New Testament. The first is from St. Paul&apos;s Epistle to the Ephesians (5:20-33), where he exhorts married couples “to be subject to one another out of reverence for Christ.” The second reading is from the Gospel of John (2:1-11) relating the miracle of Christ at the Wedding at Cana. The priest gives a short homily on the readings.
          </p>
          <h2>The Common Cup</h2>
          <p>
            A cup of wine is blessed. The bride and groom each drink three times from this shared cup, signifying their shared life together. From henceforth, they will share all of life&apos;s joys and burdens together. The Common Cup is also a reference to the Wedding at Cana, in which Christ turned water into wine and blessed marriage as a joyous, exuberant, feast of companionship and community.
          </p>
          <h2>The Dance of Isaiah</h2>
          <p>
            During the Dance of Isaiah, the bride and groom, along with their koumbaro and koumbara, walk around the tetrapodion three times, holding onto the priest&apos;s epitrachelion (stole). Here, they take their first steps together as husband and wife, and begin their pilgrimage through life together. They are not alone, but accompanied by the prayers of their spiritual fathers and mothers, their sponsors, their parents, and their friends. Surrounded by the painted icons in the church and by the living icons of their loved ones present, they become an icon of marriage themselves and begin their life in mystical unity in Christ.
          </p>
          <h2>Dismissal</h2>
          <p>
            The priest gives a final blessing, and then the community sings the blessing song “God grant you many years” to the newly-married couple. 
          </p>
          <div className="mb-2">
            God is love. (1 John 4:8,16)
          </div>
        </div>
      </main>
    </div>
  );
}