import './assets/index.scss'
import Header from "../components/header";
import Footer from '../components/Footer';
const Index = () => {
  return (
    <>
    <Header/> 
    <main>
      <article className="article1">
        <section>
          <div className="row">
            <div className="bgimg">
              <div>
                <h2>Tower Roleplay: Tavo pasaulis, tavo istorija, tavo įspūdžiai!</h2>
                <p> Bendradarbiaukite su savo bendraamžiais, sukurkite naujas akimirkas, puoselėkite gyvybingą bendruomenę su „FIVEM“ varikliuku. Tegul jūsų vaizduotė yra vienintelė riba.</p>
                <a href="https://fivem.net" className="btn btn-info" role="button">Atsisiųsti</a>
              </div>
            </div>
          </div>
        </section>
      </article>

      <article className="article2">
        <section>
          <h2>Pradėkite</h2>
          <div className="row justify-content-center">
            <div className="pirmas col-4 col-md-4 col-lg-4 col-sm-4">
              <p>1 Žingsnis</p>
              <h3>Nusipirkite GTA V</h3>
              <a href="https://store.steampowered.com/agecheck/app/271590/" className="btn btn-info" role="button">Pirkti</a>
            </div>
            <div className="antras col-4 col-md-4 col-lg-4 col-sm-4">
              <p className="">2 Žingsnis</p>
              <h3>Atsisiusti Fivem</h3>
              <a href="https://fivem.net" className="btn btn-info" role="button">Atsisiųsti</a>
            </div>
            <div className="trecias col-4 col-md-4 col-lg-4 col-sm-4">
              <p>3 Žingsnis</p>
              <h3>Prisijungti I Serverį</h3>
              <a href="https://cfx.re/join/8g9px5" className="btn btn-info" role="button">Prisijungti</a>
            </div>
          </div>
        </section>
      </article>

      <article className="article3">
        <section>
          <div className="row justify-content-start">
            <div className="col-11 col-md-5 col-lg-4">
              <h1>Pasirinkite Savo Kelią</h1>
            </div>
            <div className="row justify-content-center">
              <div className="pirmas col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>
              <div className="antras col-xs-11 col-sm-11 col-md-11 col-lg-6">
                <h2 className="text-center">Išsirink Savo Svajonių Darbą</h2>
                <p className="text-center">Serveri rasite profesijas kurios atitinka jūsų pomėgius ir įgūdžius. Galimybių gausa siūlo platų spektrą darbų, pradedant policininko pareigomis, eiti per gangsterio gyvenimo būdo kelią, tapti patyrusiu baristu, rinkti šiukšles kaip miesto surinkėja arba sėsti į taksą ir tapti geriausiu "dušmanu" .Nebent esi linkęs rankas pasitepti tada siūlome mechaniko darbą.</p>
              </div>
            </div>
          </div>
        </section>
      </article>

      <article className="article4">
        <section>
          <div className="row justify-content-center">
            <div className="antras col-xs-11 col-sm-11 col-md-11 col-lg-6">
              <h2 className="text-center">Policijos Darbas</h2>
              <p className="text-center">Policininkai yra atsakingi už teisėtvarkos palaikymą, nusikaltimų prevenciją, nusikaltimų tyrimą ir žmonių saugumo užtikrinimą. Jų pareigybės gali apimti eismo reguliavimą, asmenų sulaikymą, nusikaltimų tyrimą, informacijos rinkimą, narkotikų kontrolę ir t. t.</p>
            </div>
            <div className="pirmas col-xs-1 col-sm-1 col-md-1 col-lg-2"></div>
          </div>
        </section>
      </article>

      <article className="article5">
        <section>
          <div className="row justify-content-center">
            <div className="pirmas col-xs-1 col-sm-1 col-md-1 col-lg-2"></div>
            <div className="antras col-xs-11 col-sm-11 col-md-11 col-lg-6">
              <h2 className="text-center">Nelegalios Veiklos Gaujos / Mafijos</h2>
              <p className="text-center">Mafijos ir gaujų veikla apima nelegalią, organizuotą veiklą, dažnai susijusią su nusikalstamumu ir smurtu. Šios organizacijos dažnai užsiima šiomis veiklomis:
                Narkotikų prekyba, Pinigų plovimas, Žmogžudystės ir smurtas , Nelegali prekyba ginklais.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
    <Footer/>
    </>
  );
};

export default Index;
