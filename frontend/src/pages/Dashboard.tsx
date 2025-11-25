import ControllerMainCard from "@/components/controllers/ControllerMainCard"
import CommunityMainCard from "@/components/community/CommunityMainCard"
import ProjectMainCard from "@/components/project/ProjectMainCard"

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 gap-2 border-none xl:grid-cols-3 overflow-hidden">
      <ProjectMainCard />

      <CommunityMainCard />

      <ControllerMainCard />
    </div>
  )
}

export default Dashboard
